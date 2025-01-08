/**
 * company-user controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::company-user.company-user",
  ({ strapi }) => ({
    async createUserForCompany(ctx) {
      try {
        const { body } = ctx.request;
        const data = body;
        const existingUsers = await strapi.entityService.findMany(
          "plugin::users-permissions.user",
          {
            filters: {
              email: data.email,
            },
          }
        );

        if (existingUsers.length) {
          ctx.body = {
            success: false,
            message: "User with this email already exists.",
          };
          return;
        }

        const company = await strapi.entityService.findOne(
          "api::company.company",
          data.company_id,
          {
            populate: ["Assign_AI_App"],
          }
        );
        if (!company) {
          ctx.body = {
            success: false,
            message: "Company not found.",
          };
          return;
        }
        const newCompanyUser = await strapi.entityService.create(
          "api::company-user.company-user",
          {
            data: {
              company_id: data.company_id,
              First_Name: data.first_name,
              Last_Name: data.last_name,
              employee_status: data.status,
              isCompanyAdmin: false,
            },
          }
        );
        const newUser = await strapi.entityService.create(
          "plugin::users-permissions.user",
          {
            data: {
              username: `${company.company_name}_${data.first_name}_${data.last_name}`,
              email: data.email,
              password: data.password,
              company_user: newCompanyUser.id,
              confirmed: true,
              role: 1,
            },
          }
        );
        if (data.app_ids && data.app_ids.length > 0) {
          await strapi.entityService.update(
            "api::company-user.company-user",
            newCompanyUser.id,
            {
              data: {
                company_apps: data.app_ids,
              },
            }
          );
        }
        ctx.body = {
          success: true,
          message: "User created and associated with the company successfully.",
          user: newUser,
        };
      } catch (err) {
        ctx.throw(500, err.message);
      }
    },
    async updateUserForCompany(ctx) {
      try {
        const { body } = ctx.request;
        const userId = ctx.params.id;
        const data = body;

        const existingEmployee = await strapi.entityService.findMany(
          "api::company-user.company-user",
          {
            filters: {
              id: {
                $eq: userId,
              },
            },
          }
        );

        if (!existingEmployee) {
          ctx.body = {
            success: false,
            message: "User not found.",
          };
          return;
        }
        await strapi.entityService.update(
          "api::company-user.company-user",
          existingEmployee[0].id,
          {
            
            data: {
              First_Name: data.first_name ,
              Last_Name: data.last_name ,
              employee_status: data.status ,
            }
            
          }
        );

        const CompanyUserAccountExist = await strapi.entityService.findMany(
          "plugin::users-permissions.user",
          {
            filters: {
              company_user: userId,
            },
          }
        );
        const updatedCompanyUserAccount = await strapi.entityService.update(
          "plugin::users-permissions.user",
          CompanyUserAccountExist[0].id,
          {
            data: {
              email: data.email,
              password: data.password,
            },
          }
        );
        await strapi.entityService.update(
          "api::company-user.company-user",
          userId,
          {
            data: {
              company_apps: data.app_ids?.length ? data.app_ids : [],
            },
          }
        ); 
        ctx.body = {
          success: true,
          message: "User updated successfully.",
          user: updatedCompanyUserAccount,
        };
      } catch (err) {
        ctx.throw(500, err.message);
      }
    },
    async deleteUserForCompany(ctx) {
      try {
        const userId = ctx.params.id;

        const existingCompanyUser = await strapi.entityService.findMany(
          "api::company-user.company-user",
          {
            filters: {
              id: {
                $eq: userId,
              },
            },
          }
        );

        if (!existingCompanyUser.length) {
          ctx.body = {
            success: false,
            message: "Company-User not found.",
          };
          return;
        }
        const existingUser = await strapi.entityService.findMany(
          "plugin::users-permissions.user",
          {
            filters: {
              company_user: userId,
            },
          }
        );

        await strapi.entityService.delete(
          "api::company-user.company-user",
          existingCompanyUser[0].id
        );

        if (existingUser.length) {
          await strapi.entityService.delete(
            "plugin::users-permissions.user",
            existingUser[0].id
          );
        }

        ctx.body = {
          success: true,
          message: "User and company-user deleted successfully.",
        };
      } catch (err) {
        ctx.throw(500, err.message);
      }
    },
  })
);
