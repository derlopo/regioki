/**
 * A set of functions called "actions" for `process-image`
 */

import { factories } from "@strapi/strapi";
import utils from "@strapi/utils";

const fs = require("fs");

import OpenAI from "openai";

const openai = new OpenAI();

const {
  ComputerVisionClient,
} = require("@azure/cognitiveservices-computervision");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");

const { ApplicationError } = utils.errors;

export default {
  async extractText(ctx) {
    const { files } = ctx.request.files;
    const subscriptionKey = "78800e930eaa4b66a60189193650ad68";
    const endpoint = "https://niedermayer2.cognitiveservices.azure.com/";

    const credentials = new ApiKeyCredentials({
      inHeader: { "Ocp-Apim-Subscription-Key": subscriptionKey },
    });
    const client = new ComputerVisionClient(credentials, endpoint);

    let extractedTexts = [];

    const clientOpenAI = new OpenAI({
      apiKey: process.env["OpenAIKEY"], // This is the default and can be omitted
    });

    try {
      const filesArray = Array.isArray(files) ? files : [files];
      for (const file of filesArray) {
        const imageData = fs.readFileSync(file.path); // Read the file as a buffer

        const readResponse = await client.readInStream(imageData);

        const operationLocation = readResponse.operationLocation;
        const operationId = operationLocation.split("/").slice(-1)[0];

        let readResult;
        while (true) {
          readResult = await client.getReadResult(operationId);
          if (
            readResult.status !== "notStarted" &&
            readResult.status !== "running"
          ) {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        if (readResult.status === "succeeded") {
          const results = readResult.analyzeResult.readResults;
          for (const result of results) {
            for (const line of result.lines) {
              extractedTexts.push(line.text);
            }
          }
        }
      }

      const extractedText = extractedTexts.join("\n");

      // Use the extracted texts to generate the CSV text
      const instructions = `
          ### Beschreibung:
          AUSGABESPRACHE IST IMMER DEUTSCH!
          Der GPT analysiert eingereichte Fotos von Glasschäden und extrahiert relevante Daten wie betroffene Scheibe, Fahrzeug-Identifikationsnummer, Versicherungsnummer und Fahrzeugschein. Die Daten werden ausschließlich in einer CSV-Datei ausgegeben.
          KEINE AUSGABE AUCH KEINE AUFLISTUNG!! NUR Der CSV Table AM ENDE!! In form das es direkt kopierbar ist (in die Zwischenablage)

          ### Schritt 1: Bildanalyse und Datenerfassung
          **Eingaben:**
          - Foto des Glasschadens
          - Versicherungsschein
          - Foto des Fahrzeuges mit Kennzeichen
          - Fahrzeugschein
          - Foto der Scheibe mit Herstellerangaben

          **Ausgaben:**
          - Keine Zwischenberichte oder Tabellen, keine AUSGABE AUSSER CSV

          ### Schritt 2: Extraktion und Konsistenzprüfung
          **2.1 Datenextraktion aus dem Fahrzeugschein:**
          - Kennzeichen (Feld A)
          - KBA zu 2 (Feld 2.1)
          - KBA zu 3 (Feld 2.2, nur die ersten 3 Zeichen)
          - Motorcode (D.2) -> Sind mehrere getrennte Codes. also z.B. 7HC SCXEB308X0
          - Nennleistung KW (P.2)
          - Marke (Feld D.1)
          - Modell (Feld D.3)
          - VIN (Feld E)
          - Anschrift (Feld C.1.3)
          - Nachname(Name) (Feld C.1.1), und Vorname (Feld C.1.2)

          **2.2 Datenextraktion aus dem Versicherungsschein:**
          - Versicherungsnummer
          - Versicherungsunternehmen (nicht der Makler)
          - Versicherungsbeginn
          - Versicherungsende
          - Selbstbeteiligung Teilkasko (nur wenn eindeutig zuzuordnen)
          - Werkstattbindung (Prüfe auf Vorkommen des Wortes und setze den Wert JA/Nein)
          - Fahrzeug-Identifikationsnummer (VIN) (Falls nicht vorhanden, vermerken dass keine VIN angegeben ist)

          **2.3 Konsistenzprüfung:**
          - Vergleich der Fahrzeugdaten zwischen Fahrzeugschein und Versicherungsschein (amtliches Kennzeichen, VIN, Marke, HSN, TSN)
          - Bei Abweichungen:  Warnung:
          - ***ACHTUNG: Die Fahrzeug-Identifikationsnummer (VIN) stimmt nicht überein. ***
          - Prüfung der VIN-Länge (17 Zeichen, prüfe, ob du mehr als 17 Zeichen hast):
          - ***ACHTUNG: Die erkannte Fahrzeug-Identifikationsnummer (VIN) hat eine inkorrekte Länge. Bitte überprüfen Sie die Eingaben.***
          - Vergleich von Kennzeichen auf dem Bild mit Amtliches Kennzeichen im Fahrzeugschein

          ### Schritt 3: Erstellung und Formatierung der erfassten Daten in 4 Tabellen
          **Keine Ausgabe von Zwischenberichten oder Tabellen**

          ### Schritt 4: Erweiterte Überprüfung und Validierung
          - Überprüfung der Formatierung und Vollständigkeit: Fehlende oder unleserliche Daten als "Fehlt" markieren.
          - Regelmäßige Überprüfung der Daten auf Richtigkeit im Vergleich zu den Originaldokumenten.
          - Dokumentation der Schritte und Referenzen zur Nachverfolgung und Korrektur von Fehlern.
          - Ausgabe der Validierungsergebnisse: **Keine Ausgabe**

          ### Schritt 5: CSV-Ausgabe
          **CSV-Erstellung:**
          Erstelle eine CSV semikolonseparierte Liste (am Ende jeder Zeile kein Semikolon) mit folgenden Datenfeldern:
          - Datenfeld
          - Datenwert
          Sortiere die Datenfelder in derselben Reihenfolge wie in der folgenden Beispielausgabe. Felder, fuer die Du keine Extrahierten Daten hast, Lasse den Datenwert leer, setze nur das Semikolon
          Beispiel CSV Ausgabe (Die Datenfelder müssen immer so sein, damit sie gelesen werden können; also z.B. nicht: Herlsteller statt Marke!)
          Für jedes Datenfeld wird ein Umbruch nach dem Wert eingefügt.
          (OHNE SEMIKOLON AM ENDE DER ZEILE!!!)
          \`\`\`csv
          Name;Donath
          Vorname;Irmengard
          Firma;Beispiel Firma
          Straße;Hochgernstr. 2
          PLZ;83224
          Ort;Grassau
          Vorsteuer;Nein
          Tel;1728691031
          Mail;example@example.com
          VIN;WV2ZZZHZJH057962
          KBA zu 2;603
          KBA zu 3;BVD
          Kennzeichen;EBE KD 777
          Erstzulassung;20.10.2017
          Marke;VW
          Modell;T6
          Motorcode;7HC SCXEB308X0
          Leistung KW/PS;150
          Versicherung;Baloise Sachversicherung
          Schadenstag;01.02.2024
          Schadensort;München
          Schadensnummer;12345
          Ver-Schein-Nr.;N6783L2431
          Selbstbeteiligung;150
          Schadensgrund;Unfall
          Werkstattbindung;Nein
          Vorsteuer;Nein
          Scheibe;Windschutzscheibe
          Hersteller;Saint Gobain
          \`\`\`

          ### Fehlervermeidungscode:

          1. **Überprüfung der Datenstruktur:** Sicherstellen, dass alle erforderlichen Felder in der Datenstruktur vorhanden sind.
          2. **Datentyp-Validierung:** Sicherstellen, dass alle Werte als Strings vorliegen, um Formatierungsfehler zu vermeiden.
          3. **Zeilenumbrüche:** Überprüfen, dass keine zusätzlichen Zeilenumbrüche in den Werten enthalten sind, die die CSV-Formatierung stören könnten.
          4. **Semikolon-Prüfung:** Sicherstellen, dass keine Semikolons in den Datenwerten enthalten sind, da dies die CSV-Struktur zerstören könnte. Ersetze ggf. Semikolons in den Datenwerten durch Kommas oder andere Zeichen.
          5. Telefonnummer und E-Mail nicht die von Versicherung nehmen. Außer sie ist dem Namen zuordenbar.


          Text: ${extractedText}
        `;

      const response = await clientOpenAI.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: instructions },
          {
            role: "user",
            content:
              "Bitte analysiere die oben gegebenen Texte und extrahiere alle relevanten Daten.",
          },
        ],
      });

      // Assuming `response` is the response object from the OpenAI API
      const responseText = response.choices[0].message.content;

      // Split the response text into lines
      const lines = responseText.split("\n");

      // Filter out empty lines
      const filteredLines = lines.filter((line) => line.trim() !== "");

      // Convert the filtered lines into CSV format
      const csvContent = filteredLines.join("\n");

      // Example: Saving the CSV content to a file or copying it to the clipboard
      // console.log(csvContent);

      ctx.body = {
        response,
        csvContent,
      };
    } catch (error) {
      // console.error("Error processing images:", error);
      ctx.throw(500, "An error occurred while processing the images.");
    }
  },

  extractJsonFromResponse(response) {
    const jsonStart = response.indexOf("```json") + 7;
    const jsonEnd = response.indexOf("```", jsonStart);

    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonContent = response.substring(jsonStart, jsonEnd).trim();
      return JSON.parse(jsonContent);
    }
    return null;
  },
  async newExtractTextFunc(ctx) {
    const fileUploads = [];
    /**
     * Until a file is upload it remains in a temporary state, so
     * in order provide a file name and extension we first need to
     * store in to our server and then we can provide it a filename
     * and extension. After the right file has been uploaded to openai
     * we can delete the file
     */
    try {
      const images = ctx.request.files.files; // Adjust this to match the Blob input format in Strapi

      const imagesArray = Array.isArray(images) ? images : [images];

      const destinationPath = "public/uploads/openai"; // Path to the public folder

      // create the folder for openai to hold the uploaded file if the folder not exist
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }

      for (const image of imagesArray) {
        const fileName = `${destinationPath}/${image.name}`;
        // read file synchronously
        const fileData = fs.readFileSync(image.path);

        // create file synchronously
        fs.writeFileSync(fileName, fileData);

        const fileUpload = await openai.files.create({
          // Read the file from folder which has proper name
          file: fs.createReadStream(fileName),
          purpose: "vision",
        });
        fileUploads.push(fileUpload);

        // Delete file after use
        fs.unlinkSync(fileName);
      }

      const thread = await openai.beta.threads.create();
      const message = await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: fileUploads.map((fileUpload) => ({
          type: "image_file",
          image_file: { file_id: fileUpload.id },
        })),
      });

      const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: "asst_TBAv1scj9mZXWGgpF41hQXch",
      });

      if (run.status === "completed") {
        const messages: any = await openai.beta.threads.messages.list(
          run.thread_id
        );
        const responseText = this.extractJsonFromResponse(
          messages.data[0].content[0].text?.value
        );

        // Return the text directly
        return (ctx.body = { responseText, success: true });
      }
    } catch (error) {
      ctx.throw(500, `Error: ${error.message}`);
    }
  },
};
