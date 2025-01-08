export default {
    routes: [
          {
            method: "POST",
            path: "/company-users/createUserForCompany",
            handler: "company-user.createUserForCompany",
          },
          {
            method: 'PUT',
            path: '/company-users/updateUserForCompany/:id',
            handler: 'company-user.updateUserForCompany',
            },
            {
              method: 'DELETE',
              path: '/company-users/deleteUserForCompany/:id',
              handler: 'company-user.deleteUserForCompany',
              },
    ],
  }