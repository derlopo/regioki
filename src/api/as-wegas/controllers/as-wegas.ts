/**
 * A set of functions called "actions" for `process-image`
 */

import { factories } from "@strapi/strapi";
import utils from "@strapi/utils";

const fs = require("fs");

import OpenAI from "openai";

const {
  ComputerVisionClient,
} = require("@azure/cognitiveservices-computervision");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");

const { ApplicationError } = utils.errors;

const baseUrl = "https://accapi.as-wegas.de/api";
const loginUrl = `${baseUrl}/Login`;
const businessUnitId = "cb511d2c-4873-4452-bb02-c1f909a6e5e6"; // Business Unit ID
const salesTaskKindId = "6BCE6987-555B-4C77-80D5-9FBB00E37B36"; // Glas fitting ID

// Login credentials (replace with your actual username and password)
const loginCredentials = {
  User: "API_82542",
  Password: "ga4A3jb843B6",
};
export default {
  // Step 1: Login and Get Token
  async login() {
    console.log("Attempting to log in...");
    console.log("Login URL:", loginUrl);

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginCredentials),
      });

      console.log("Login response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Failed response body:", errorText);
        throw new Error(`Login failed: HTTP-Error ${response.status}`);
      }

      const data: any = await response.json();
      console.log("Login response body:", data);

      const token = data?.Result?.Token;
      console.log("Login successful, Token:", token);

      return token;
    } catch (error) {
      console.error("Error during login:", error);
      return null;
    }
  },

  // Step 2: Create a new SalesTask
  async createSalesTask(token) {
    const url = `${baseUrl}/SalesTask/create/${businessUnitId}/${salesTaskKindId}`;
    console.log("Creating SalesTask with URL:", url);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Create SalesTask response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Failed response body:", errorText);
        throw new Error(
          `HTTP-Error: ${response.status}, Response: ${errorText}`
        );
      }

      const data: any = await response.json();
      console.log("SalesTask created successfully:", data);
      return data?.Result; // Return the full SalesTask result including CommandIDs
    } catch (error) {
      console.error("Error creating SalesTask:", error);
    }
  },

  // Step 3: Get the newly created SalesTask (optional)
  async getSalesTask(token, salesTaskId) {
    const url = `${baseUrl}/SalesTask/${salesTaskId}`;
    console.log("Getting SalesTask with URL:", url);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `${token}` },
      });

      console.log("Get SalesTask response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Failed response body:", errorText);
        throw new Error(
          `HTTP-Error: ${response.status}, Response: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Retrieved SalesTask:", data);
      return data;
    } catch (error) {
      console.error("Error retrieving SalesTask:", error);
    }
  },

  // Mapping function
  mapDatenToRequestBody(daten, salesTaskId, commandIDs) {
    return {
      Id: salesTaskId,
      BusinessUnitId: "cb511d2c-4873-4452-bb02-c1f909a6e5e6",
      BusinessUnitDisplayText: "Niedermayr GbmH Stephanskirchen [82542]",
      BusinessUnitBlockInvoiceTransmission: true,
      IsDeleted: false,
      Number: daten["ID"] || null, // Map 'ID' from 'daten'
      NumberDisplay: daten["ID"] || null, // Adjust as needed
      CustomerTaskNumber: null, // Map if applicable
      CreateDateTime: new Date().toISOString(),
      SalesTaskKindId: "6bce6987-555b-4c77-80d5-9fbb00e37b36",
      SalesTaskKindDisplayText: "Neuverglasung",
      SalesTaskStateId: "ENTERED",
      SalesTaskStateDisplayText: "Erfasst",
      DamageData: {
        BusinessUnitId: "cb511d2c-4873-4452-bb02-c1f909a6e5e6",
        BusinessUnitDisplayText: "Niedermayr GbmH Stephanskirchen [82542]",
        DateTime: daten["Schadenstag"] || null,
        Location: daten["Schadensort"] || null,
        Number: daten["Schadensnummer"] || null,
        InsurancePolicyNumber: daten["Ver-Schein-Nr"] || null,
        PartialCoverDeductionValue:
          parseFloat(daten["Selbstbeteiligung"]) || 0.0,
        DamageCause: daten["Schadensgrund"] || null,
        // Additional fields can be mapped here
        DomainType: "SalesTaskDamageDataProxy",
        ParentDomainType: null,
        CommandIDs: [
          "ViewSalesTaskSalesTaskDamageData",
          "EditSalesTaskSalesTaskDamageData",
        ],
        FieldInfos: [],
        Summary: null,
      },
      CustomerVehicle: {
        Id: "0aad5348-f767-41e6-94c4-b1e8014810ee",
        BusinessUnitId: "cb511d2c-4873-4452-bb02-c1f909a6e5e6",
        BusinessUnitDisplayText: "Niedermayr GbmH Stephanskirchen [82542]",
        VIN: daten["VIN"] || null,
        NumberPlate: daten["Kennzeichen"] || null,
        RegistrationDate: daten["Erstzulassung"] || null,
        Mileage: daten["KM-Stand"] || null,
        // Additional fields can be mapped here
        DomainType: "CustomerVehicleProxy",
        ParentDomainType: null,
        CommandIDs: [
          "EditSalesTaskCustomerVehicle",
          "ViewSalesTaskCustomerVehicle",
          "EditSalesTaskCustomerVehicle",
        ],
        FieldInfos: [],
        Summary: null,
      },
      // Map other necessary fields from 'daten' to 'requestBody'
      DefaultVATRatePercentage: parseFloat(daten["Vorsteuer"]) || 19.0,
      DefaultVATRateID: "afe884b2-cb7e-47b3-8304-a02901157a34",
      DefaultVATRateDisplayText: "Standard 19%",
      // Continue mapping other fields as needed
      CommandIDs: commandIDs,
      FieldInfos: [], // Include if necessary
      Summary: null,
    };
  },

  // Step 4: Post data to the SalesTask
  async postSalesTaskData(token, salesTaskId, commandIDs, daten) {
    const url = `${baseUrl}/SalesTask`;

    // Map 'daten' to 'requestBody' using the mapping function
    const requestBody = this.mapDatenToRequestBody(
      daten,
      salesTaskId,
      commandIDs
    );

    console.log("Posting data to SalesTask with URL:", url);
    console.log("Post request body:", requestBody);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Post SalesTask response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Failed response body:", errorText);
        throw new Error(
          `HTTP-Error: ${response.status}, Response: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("SalesTask updated successfully:", data);
    } catch (error) {
      console.error("Error posting data to SalesTask:", error);
    }
  },

  // Step 5: Logout
  async logout(token) {
    console.log("Attempting to log out...");
    const logoutUrl = `${baseUrl}/Logout`;
    console.log("Logout URL:", logoutUrl);

    try {
      const response = await fetch(logoutUrl, {
        method: "GET",
        headers: {
          Authorization: `${token}`, // Add the token in the Authorization header
          "Content-Type": "application/json",
        },
      });

      console.log("Logout response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Failed response body:", errorText);
        throw new Error(`Logout failed: HTTP-Error ${response.status}`);
      }

      console.log("Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },

  // Main function that orchestrates the steps
  async runApiInteraction(ctx) {
    console.log("Starting process...");

    const { data } = ctx.request.body;

    // Step 1: Login and get the token
    const token = await this.login();

    if (token) {
      // Step 2: Create a SalesTask
      const salesTaskResult = await this.createSalesTask(token);

      if (salesTaskResult?.Id) {
        console.log("SalesTask ID:", salesTaskResult.Id);
        console.log("CommandIDs:", salesTaskResult.CommandIDs);

        // Step 3: Retrieve the created SalesTask (optional)
        await this.getSalesTask(token, salesTaskResult.Id);

        // Step 4: Post data to the SalesTask
        await this.postSalesTaskData(
          token,
          salesTaskResult.Id,
          salesTaskResult.CommandIDs,
          data
        );

        // Step 5: Logout
        await this.logout(token);

        ctx.body = {
          success: true,
          message: "successfull",
        };
      } else {
        console.error("Failed to create SalesTask.");

        ctx.body = {
          success: false,
          message: "failed",
        };
      }
    } else {
      console.error("Failed to log in and get a token.");
      ctx.body = {
        success: false,
        message: "failed",
      };
    }
  },
};
