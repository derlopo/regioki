import { factories } from "@strapi/strapi";
export default factories.createCoreController(
  "api::dynamic-form.dynamic-form",
  ({ strapi }) => ({
    async customFind(ctx) {
      let { page = 1, pageSize = 10 } = ctx.query.pagination; // Default values if not provided
      const sortArray = ctx.query.sort || [];
      const sortField = sortArray[0]?.split(':')[0] || 'id';
      const sortDirection = sortArray[0]?.split(':')[1] || 'desc';
      const filtersFromQuery = ctx.query.filters || {};
      const companyID = filtersFromQuery["company_userID.id"]?.["$eq"];
      const nameFilter = filtersFromQuery["form_data.Name"]?.["$contains"];
      console.log('SortField:', sortField, 'SortDirection:', sortDirection);


      let strapiFilters = {};
      if (companyID) {
        strapiFilters["company_userID"] = { id: { $eq: companyID } };
      }

      const knex = strapi.db.connection;

      // Initial Strapi query to get filtered IDs
      const strapiQuery = {
        filters: strapiFilters,
        sort: [{ id: sortDirection }],
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
        },
      };


      const strapiResults = await strapi.entityService.findMany(
        "api::dynamic-form.dynamic-form",
        strapiQuery
      );
      const filteredIds = strapiResults.map((result) => result.id);

      let finalResults;
      let totalCount;

      if (nameFilter) {
        // Count and fetch results with Knex for name, Kennzeichen, and id filtering
        finalResults = await knex("dynamic_forms")
          .select("*")
          .whereIn("id", filteredIds)
          .whereRaw(
            `
          (form_data->>'Name' ILIKE ? OR form_data->>'VIN' ILIKE ? OR form_data->>'Ver-Schein-Nr.' ILIKE ? OR form_data->>'Kennzeichen' ILIKE ? OR CAST(id AS TEXT) ILIKE ?)
        `,
            [
              `%${nameFilter}%`,
              `%${nameFilter}%`,
              `%${nameFilter}%`,
              `%${nameFilter}%`,
              `%${nameFilter}%`,
            ]
          ) // ILIKE for partial matches, CAST id to text for matching
          .offset((parseInt(page) - 1) * parseInt(pageSize))
          .limit(parseInt(pageSize))
          // .orderByRaw(`"${sortField}" ${sortDirection}`) // Use orderByRaw to properly handle sorting



        const countQuery = await knex("dynamic_forms")
          .count("* as count")
          .whereIn("id", filteredIds)
          .whereRaw(
            `
          (form_data->>'Name' ILIKE ? OR form_data->>'VIN' ILIKE ? OR form_data->>'Ver-Schein-Nr.' ILIKE ? OR form_data->>'Kennzeichen' ILIKE ? OR CAST(id AS TEXT) ILIKE ?)
        `,
            [
              `%${nameFilter}%`,
              `%${nameFilter}%`,
              `%${nameFilter}%`,
              `%${nameFilter}%`,
              `%${nameFilter}%`,
            ]
          )

        totalCount = countQuery[0].count;
        console.log(totalCount)
      } else {
        // No name filter; paginate the already filtered results
        totalCount = filteredIds.length;
        finalResults = strapiResults.slice(
          (parseInt(page) - 1) * parseInt(pageSize),
          parseInt(page) * parseInt(pageSize)
        );
      }
      console.log('Sorting:', sortField, sortDirection);


      const sanitizedResults = await this.sanitizeOutput(
        { results: finalResults },
        ctx
      );

      return this.transformResponse({
        data: sanitizedResults,
        meta: {
          pagination: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            pageCount: Math.ceil(totalCount / pageSize),
            total: totalCount,
          },
        },
      });
    },
  })
);
