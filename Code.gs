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








// Function to save the QR code Blob to Google Drive
function saveQRCodeToDrive(qrCodeBlob, fileName) {
  var folderName = "QR Codes";

  try {
    var folders = DriveApp.getFoldersByName(folderName);
    var folder;

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }

    var file = folder.createFile(qrCodeBlob);

    // Set sharing permissions
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    // Log the file URL (optional)
    Logger.log('QR code saved to Drive: ' + file.getUrl());
  } catch (error) {
    // Log and return an error message
    Logger.log('Error saving QR code to Drive: ' + error.toString());
    return "Error: " + error.toString();
  }
}


function getAndPassColumnAData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1"); // Replace with your sheet name
  var data = sheet.getRange("F:G").getValues();
  var columnAData = [];
  
  for (var i = 1; i < data.length; i++) { // Assuming the first row is headers
    var cellA = data[i][0];
    var cellB = data[i][1];
    
    if (cellA && !cellB) { // If column A is not empty and column B is empty
      columnAData.push(cellA);
    }
  }

  return columnAData;
}
// to be further optimized
function saveQRCodeToDrive(img) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); // Modify this to target a specific sheet

  var folderName = "QR Codes";
  // to be made: tentative for loop to get range from B to G, then check if B has value and G has none; True: fileName = columnB.value + ".svg", False: Skip
  
  // to be made: tentative for loop to get range from B to G, then check if B has value and G has none; True: fileName = columnB.value + ".png", False: Skip
  var fileName; // Change static filename.svg to get column B from sheets if column G is empty

  var columnB = sheet.getRange("B:B").getValues(); // Get all values in column B
  var columnG = sheet.getRange("G:G").getValues(); // Get all values in column G

  for (var i = 1; i < columnB.length; i++) {
    var cellB = columnB[i][0];
    var cellG = columnG[i][0];
    
    if (cellB && !cellG) { // If column B has a value and column G is empty
      fileName = cellB + ".png"; // Change the file extension to .png
      break; // Exit the loop once a matching row is found
    }
  }

  try {
    // Get the folder by name or create it if it doesn't exist
    var folders = DriveApp.getFoldersByName(folderName);
    var folder;
    
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }
    
    // const canvas = document.getElementById('canvas');
    // const img = canvas.toDataURL('image/png');
    var qrCodeBlob = Utilities.newBlob(Utilities.base64Decode(img.split(',')[1]), 'image/png', fileName);
    
    var file = folder.createFile(qrCodeBlob);
    
    // Set sharing permissions
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Find the row with data in column A but no data in column B
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); // Modify this to target a specific sheet
    var data = sheet.getRange("F:G").getValues();
    
    for (var i = 1; i < data.length; i++) { // Assuming the first row is headers
      var cellA = data[i][0];
      var cellB = data[i][1];
      
      if (cellA && !cellB) { // If column A is not empty and column B is empty
        var rowIndex = i + 1; // Adding 1 to account for 0-based indexing
        // Mark the current row as "Done" in column G
        sheet.getRange(rowIndex, 7).setValue("Done");
        break; // Exit the loop once a matching row is found
      }
    }

    return fileName;
  } catch (error) {
    return "Error: " + error.toString();
  }
}
