/**
 * company controller
 */

import { factories } from "@strapi/strapi";
import utils from "@strapi/utils";

const { ApplicationError } = utils.errors;
const { getService } = require("@strapi/plugin-users-permissions/server/utils");

export default factories.createCoreController(
  "api::company.company",
  ({ strapi }) => ({
    async createCompany(ctx) {
      try {
        const { files, body } = ctx.request;
        const data = body;
        let logoFileUrl = null;

        const expectedUsers = await strapi.entityService.findMany(
          "plugin::users-permissions.user",
          {
            filters: {
              email: data.email,
            },
          }
        );

        if (expectedUsers.length) {
          ctx.body = {
            success: false,
            message: "Company with this email already exist.",
          };
          return;
        }

        const alreadyCompanyExist = await strapi.entityService.findMany(
          "api::company.company",
          {
            filters: {
              company_name: data.company_name,
            },
          }
        );

        if (alreadyCompanyExist.length) {
          ctx.body = {
            success: false,
            message: "Company with this name already exist.",
          };
          return;
        }

        if (files && files.logo) {
          const logoFile = files.logo;

          // Upload the file to Strapi
          const uploadedFiles = await strapi.plugins[
            "upload"
          ].services.upload.upload({
            data: {},
            files: logoFile,
          });

          if (uploadedFiles && uploadedFiles.length > 0) {
            logoFileUrl = uploadedFiles[0].id;
          }
        }
        const newCompany = await strapi.entityService.create(
          "api::company.company",
          {
            data: {
              company_name: data.company_name,
              address: data.address,
              contact_person: data.contact_person,
              tax_id: data.tax_id,
              Company_TypeID: data.company_type,
              company_status: data.company_status,
              company_users: data.company_users,
              description: data.description,
              logo: logoFileUrl || null,
            },
          }
        );

        const company_apps_list = [];
        if (data.Assign_AI_App != "") {
          data.Assign_AI_App = data.Assign_AI_App.split(",");

          for (const app of data.Assign_AI_App) {
            const company_apps = await strapi.entityService.create(
              "api::company-app.company-app",
              {
                data: {
                  apps_id: app,
                  company_id: newCompany.id,
                },
              }
            );
            company_apps_list.push(company_apps.id);
          }
        }

        const newCompanyUser = await strapi.entityService.create(
          "api::company-user.company-user",
          {
            data: {
              company_id: newCompany.id,
              isCompanyAdmin: true,
              company_apps: company_apps_list,
            },
          }
        );

        const newUser = await strapi.entityService.create(
          "plugin::users-permissions.user",
          {
            data: {
              username: data.company_name,
              email: data.email,
              password: data.password,
              company_user: newCompanyUser.id,
              confirmed: true,
              role: 1,
            },
          }
        );
        ctx.body = {
          company: newCompany,
          success: true,
          message: "Company is created successfully along with User.",
        };
      } catch (err) {
        throw new ApplicationError(err.message);
      }
    },
    async getCompanyDetail(ctx) {
      try {
        const { id } = ctx.params;

        const company = await strapi.entityService.findOne(
          "api::company.company",
          id,
          {
            populate: ["logo", "Assign_AI_App.apps_id", "Company_TypeID"],
          }
        );

        if (!company) {
          return ctx.notFound("Company not found");
        }

        ctx.body = {
          company,
          success: true,
          message: "Company details retrieved successfully",
        };
      } catch (err) {
        ctx.throw(500, err.message);
      }
    },

    async getCompaniesPaginated(ctx) {
      try {
        const {
          page = 1,
          pageSize = 10,
          search = "",
          sort = "createdAt:desc",
        } = ctx.query;

        const filters = search
          ? {
              $or: [
                { company_name: { $containsi: search } },
                { id: { $containsi: search } },
              ],
            }
          : {};

        const [sortField, sortDirection] = sort.split(":");

        const companies = await strapi.entityService.findMany(
          "api::company.company",
          {
            populate: ["logo", "Assign_AI_App.apps_id", "Company_TypeID"],
            filters,
            pagination: {
              page: parseInt(page, 10),
              pageSize: parseInt(pageSize, 10),
            },
            sort: { [sortField]: sortDirection },
          }
        );

        const totalCompanies = await strapi.entityService.count(
          "api::company.company",
          { filters }
        );

        ctx.body = {
          data: companies,
          meta: {
            pagination: {
              page: parseInt(page, 10),
              pageSize: parseInt(pageSize, 10),
              total: totalCompanies,
              pageCount: Math.ceil(totalCompanies / pageSize),
            },
          },
          success: true,
          message: "Companies retrieved successfully",
        };
      } catch (err) {
        ctx.throw(500, err.message);
      }
    },

    async updateCompany(ctx) {
      try {
        const { files, body } = ctx.request;
        const data = body;
        const { id } = ctx.params;
        let logo;

        const existingCompany = await strapi.entityService.findOne(
          "api::company.company",
          id,
          {
            populate: ["company_users.user"],
          }
        );

        if (!existingCompany) {
          ctx.throw(404, "Company not found");
        }

        const alreadyCompanyExistWithName = await strapi.entityService.findMany(
          "api::company.company",
          {
            filters: {
              company_name: data.company_name,
              id: {
                $ne: id,
              },
            },
          }
        );

        if (alreadyCompanyExistWithName.length) {
          ctx.body = {
            success: false,
            message: "Company with this name already exist.",
          };
          return;
        }

        if (files && files.logo) {
          const logoFile = files.logo;

          // Upload the new logo file to Strapi
          const uploadedFiles = await strapi.plugins[
            "upload"
          ].services.upload.upload({
            data: {},
            files: logoFile,
          });

          if (uploadedFiles && uploadedFiles.length > 0) {
            logo = uploadedFiles[0].id;
          }
        }
        const payload: any = {
          company_name: data.company_name || existingCompany.company_name,
          address: data.address || existingCompany.address,
          contact_person: data.contact_person || existingCompany.contact_person,
          tax_id: data.tax_id || existingCompany.tax_id,
          Company_TypeID: data.company_type || existingCompany.Company_TypeID,
          company_status: data.company_status || existingCompany.company_status,
          company_users: data.company_users || existingCompany.company_users,
          description: data.description || existingCompany.description,
        };

        // Only add logo property to payload if logo value exist
        logo && (payload.logo = logo);

        const updatedCompany = await strapi.entityService.update(
          "api::company.company",
          id,
          {
            data: payload,
          }
        );

        if (data.Assign_AI_App != undefined) {
          if (Array.isArray(data.Assign_AI_App)) data.Assign_AI_App;
          else {
            data.Assign_AI_App = data.Assign_AI_App.split(",");
          }
        } else {
          data.Assign_AI_App = [];
        }

        const foundApps = await strapi.entityService.findMany("api::app.app", {
          filters: {
            company_apps: {
              company_id: {
                id: {
                  $eq: id,
                },
              },
            },
          },
          populate: ["company_apps.company_id"],
        });
        const unmatchedItems = [];

        for (let item of foundApps) {
          const notalreadyExist = data.Assign_AI_App?.every((app) => {
            return item.id != app;
          });

          if (notalreadyExist) {
            unmatchedItems.push(item);
          }
        }
        for (let item of unmatchedItems) {
          const companyApps = await strapi.entityService.findMany(
            "api::company-app.company-app",
            {
              filters: {
                apps_id: {
                  id: {
                    $eq: item.id,
                  },
                },
                company_id: {
                  id: {
                    $eq: Number(id),
                  },
                },
              },
            }
          );

          for (let companyApp of companyApps) {
            await strapi.entityService.delete(
              "api::company-app.company-app",
              companyApp.id
            );
          }
        }

        for (const assignapp of data.Assign_AI_App) {
          const alreadyExist = foundApps.some((app) => {
            return app.id == assignapp;
          });

          if (!alreadyExist) {
            await strapi.entityService.create("api::company-app.company-app", {
              data: {
                apps_id: assignapp,
                company_id: id,
              },
            });
          }
        }

        let adminUser;
        if (
          existingCompany?.company_users &&
          existingCompany.company_users.length > 0
        ) {
          adminUser =
            existingCompany.company_users.find((user) => user.isCompanyAdmin) ??
            existingCompany.company_users[0];
        } else {
          adminUser = null; // or create a new user as needed
        }

        if (adminUser?.user?.id && data.password && data.password.length) {
          await strapi.entityService.update(
            "plugin::users-permissions.user",
            adminUser.user.id,
            {
              data: {
                password: data.password,
                role: 1,
              },
            }
          );
        } else if (!adminUser) {
          /**********************/

          const users = await strapi.entityService.findMany(
            "plugin::users-permissions.user",
            {
              filters: {
                email: data.email,
              },
              populate: ["company_user"],
            }
          );

          if (users.length) {
            if (users[0].company_user) {
            } else {
              adminUser = await strapi.entityService.create(
                "api::company-user.company-user",
                {
                  data: {
                    user: users[0].id,
                    company_id: id,
                    employee_status: "active",
                    isCompanyAdmin: true,
                  },
                }
              );
            }

            if (data.password && data.password.length) {
              await strapi.entityService.update(
                "plugin::users-permissions.user",
                users[0].id,
                {
                  data: {
                    password: data.password,
                    role: 1,
                  },
                }
              );
            }
          } else {
            adminUser = await strapi.entityService.create(
              "api::company-user.company-user",
              {
                data: {
                  company_id: id,
                  isCompanyAdmin: true,
                  employee_status: "active",
                },
              }
            );

            const user = await strapi.entityService.create(
              "plugin::users-permissions.user",
              {
                data: {
                  username: data.company_name,
                  email: data.email,
                  password: data.password,
                  company_user: adminUser.id,
                  confirmed: true,
                  role: 1,
                },
              }
            );
          }
        }

        const company_apps_list = await strapi.entityService.findMany(
          "api::company-app.company-app",
          {
            filters: {
              company_id: {
                id: {
                  $eq: id,
                },
              },
            },
          }
        );

        const latestcompany_apps_ids = company_apps_list.map((app) => app.id);

        await strapi.entityService.update(
          "api::company-user.company-user",
          adminUser?.id,
          {
            data: {
              company_apps: latestcompany_apps_ids,
            },
          }
        );

        ctx.body = {
          company: updatedCompany,
          success: true,
          message: "Company updated successfully.",
        };
      } catch (err) {
        throw new ApplicationError(err.message);
      }
    },
    async deleteCompany(ctx) {
      try {
        const { id } = ctx.params;

        const existingCompany = await strapi.entityService.findOne(
          "api::company.company",
          id,
          {
            populate: [
              "company_users.user",
              "Assign_AI_App",
              "ai_tokens",
              "company_users.Dynamic_Forms",
            ],
          }
        );

        if (!existingCompany) {
          ctx.throw(404, "Company not found");
        }

        const companyUserIds = existingCompany.company_users.map(
          (company_user) => company_user?.id
        );
        const userIds = existingCompany.company_users.map(
          (company_user) => company_user?.user?.id
        );
        const dynamicFormIds = [];
        existingCompany.company_users.map((company_user) =>
          company_user?.Dynamic_Forms.map((form) => {
            dynamicFormIds.push(form.id);
          })
        );
        const companyAppIds = existingCompany.Assign_AI_App.map(
          (app) => app?.id
        );
        const aiTokenIds = existingCompany.ai_tokens.map(
          (aiToken) => aiToken?.id
        );

        await strapi.entityService.delete(
          "api::company.company",
          existingCompany.id
        );
        await strapi.db.query("api::company-user.company-user").deleteMany({
          where: {
            id: companyUserIds,
          },
        });

        await strapi.db.query("plugin::users-permissions.user").deleteMany({
          where: {
            id: userIds,
          },
        });

        await strapi.db.query("api::dynamic-form.dynamic-form").deleteMany({
          where: {
            id: dynamicFormIds,
          },
        });

        await strapi.db.query("api::company-app.company-app").deleteMany({
          where: {
            id: companyAppIds,
          },
        });

        await strapi.db.query("api::ai-token.ai-token").deleteMany({
          where: {
            id: aiTokenIds,
          },
        });

        ctx.body = {
          success: true,
          message: "Company deleted successfully.",
        };
      } catch (err) {
        throw new ApplicationError(err.message);
      }
    },
  })
);
