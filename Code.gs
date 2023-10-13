function doGet() {
  var columnAData = getAndPassColumnAData();
  // Create HTML output with data
  var htmlOutput = HtmlService.createTemplateFromFile('Page');
  htmlOutput.data = columnAData;

  return htmlOutput.evaluate().setTitle('QR Code Web App');
}

function generateAndSaveQRCodes() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); // Modify this to target a specific sheet
  var data = sheet.getRange("B:B").getValues(); // Get all values in column B

  for (var i = 1; i < data.length; i++) {
    var cellB = data[i][0];

    if (cellB) { // If column B has a value
      var fileName = cellB + ".png"; // Change the file extension to .png

      // Check if the QR code for this name has already been generated
      var columnG = sheet.getRange("G:G").getValues();
      var cellG = columnG[i][0];

      if (!cellG) { // If column G is empty for this row
        // Generate QR code
        var qrCodeBlob = generateQRCode(cellB);

        // Save to Drive
        saveQRCodeToDrive(qrCodeBlob, fileName);

        // Mark the current row as "Done" in column G
        sheet.getRange(i + 1, 7).setValue("Done");
      }
    }
  }
}




// Function to generate QR code and return it as a Blob
async function generateQRCode(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const qrCode = new QRCodeStyling({
        width: 600,
        height: 600,
        type: "canvas",
        data: data,
        dotsOptions: {
          color: "#000000",
          type: "rounded"
        },
        backgroundOptions: {
          color: "#ffffff",
        },
      });

      const canvas = document.createElement('canvas');
      await qrCode.append(canvas);

      // Generate QR code synchronously
      const qrCodeBlob = await qrCode.createBlob();
      resolve(qrCodeBlob);
    } catch (error) {
      reject(error);
    }
  });
}
