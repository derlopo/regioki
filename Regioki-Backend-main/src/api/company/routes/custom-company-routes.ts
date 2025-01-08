export default {
  routes: [
    {
      method: "POST",
      path: "/companies/createCompany",
      handler: "company.createCompany",
    },
    {
      method: "GET",
      path: "/companies/companies_Detail/:id",
      handler: "company.getCompanyDetail",
    },
    {
      method: "GET",
      path: "/companies/getPaginatedCompanies",
      handler: "company.getCompaniesPaginated",
    },
    {
      method: "PUT",
      path: "/companies/update_Company/:id",
      handler: "company.updateCompany",
    },
    {
      method: "DELETE",
      path: "/companies/deleteCompany/:id",
      handler: "company.deleteCompany",
    },
  ],
};
