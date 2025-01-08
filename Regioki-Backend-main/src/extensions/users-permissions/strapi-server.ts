import { loginMessages } from "../../../config/constants";

const utils = require("@strapi/utils");
const { getService } = require("@strapi/plugin-users-permissions/server/utils");
const {
  validateCallbackBody,
} = require("@strapi/plugin-users-permissions/server/controllers/validation/auth");

const { sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;
const strapiIO: any = strapi;
const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

module.exports = (plugin) => {
  const existingAuthControllers = plugin.controllers.auth;
  const newAuthControllers = {
    // Admin Login
    async adminLogin(ctx) {
      {
        try {
          const { data } = ctx.request.body;
          const expectedUsers = await strapi.entityService.findMany(
            "plugin::users-permissions.user",
            {
              filters: {
                email: data.email,
                company_user: {
                  id: {
                    $null: true,
                  },
                },
              },
              populate: {
                company_user: {
                  populate: {
                    company_id: {
                      populate: {
                        logo: {
                          populate: ["*"],
                        },
                      },
                    },
                  },
                },
                role: true, // Populating role directly
              },
            }
          );
          await loginFunction(expectedUsers, data, ctx);
        } catch (error) {
          throw new ApplicationError(error.message);
        }
      }
    },
    // Customer Login
    async customerLogin(ctx) {
      try {
        const { data } = ctx.request.body;
        const expectedUsers = await strapi.entityService.findMany(
          "plugin::users-permissions.user",
          {
            filters: {
              email: data.email,
              company_user: {
                id: {
                  $notNull: true,
                },
              },
            },
            populate: {
              company_user: {
                populate: {
                  company_id: {
                    populate: {
                      logo: {
                        populate: ["*"],
                      },
                    },
                  },
                },
              },
              role: true, // Populating role directly
            },
          }
        );
        if (expectedUsers[0]?.company_user?.company_id?.company_status === "inactive") {
          ctx.body = {
            success: false,
            message: 'Your account is inactive',
          };
        }
        else if(expectedUsers[0]?.company_user?.employee_status === "inactive"){
          ctx.body = {
            success: false,
            message: 'Your account is inactive',
          };
        }
       else if (!expectedUsers[0].company_user.company_id) {
          // No company_user exists
          ctx.body = {
            success: false,
            message: 'No associated company user found',
          };
        }
        else 
        {
          await loginFunction(expectedUsers, data, ctx);
        }
      } catch (error) {
        throw new ApplicationError(error.message);
      }
    },
  };
  const loginFunction = async (expectedUsers, data, ctx) => {
    if (expectedUsers.length) {
      const isconfirmed = expectedUsers[0].confirmed;
      const isValidPassword = await getService("user").validatePassword(
        data.password,
        expectedUsers[0].password
      );
      if (isValidPassword && isconfirmed) {
        const jwtToken = getService("jwt").issue({
          id: expectedUsers[0].id,
        });
        const { password, ...userWithoutPassword } = expectedUsers[0];

        // If the user has successfully logged in

        if (userWithoutPassword.id) {
          const user_id = userWithoutPassword.id;
          const ip_address = ctx.request.ip;
          const timestamp = new Date();

          await strapi.entityService.create(
            "api::login-history.login-history",
            {
              data: {
                user_id,
                ip_address,
                timestamp,
              },
            }
          );
        }
        ctx.body = {
          jwt: jwtToken,
          // data: await sanitizeUser(userWithoutPassword, ctx),
          data: userWithoutPassword,
          success: true,
          message: loginMessages.success,
        };
      } else {
        if (!isconfirmed) {
          ctx.body = {
            success: false,
            message: loginMessages.noConfirmation,
          };
        } else {
          ctx.body = {
            success: false,
            message: loginMessages.invalidCreds,
          };
        }
      }
    } else {
      ctx.body = {
        success: false,
        message: loginMessages.invalidCreds,
      };
    }
  };

  plugin.controllers.auth = {
    ...newAuthControllers,
    ...existingAuthControllers,
  };

  const newRoutes = [
    // Admin User Routes
    {
      method: "POST",
      path: "/auth/admin/login",
      handler: "auth.adminLogin",
      config: {
        middlewares: ["plugin::users-permissions.rateLimit"],
        prefix: "",
      },
    },

    // Customer User Routes
    {
      method: "POST",
      path: "/auth/customer/login",
      handler: "auth.customerLogin",
      config: {
        middlewares: ["plugin::users-permissions.rateLimit"],
        prefix: "",
      },
    },
  ];
  let existingRoutes = plugin.routes["content-api"].routes;
  plugin.routes["content-api"].routes = [...existingRoutes, ...newRoutes];

  return plugin;
};
