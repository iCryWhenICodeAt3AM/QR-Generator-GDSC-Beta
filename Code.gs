function doGet() {
  var columnAData = getAndPassColumnAData();
  // Create HTML output with data
  var htmlOutput = HtmlService.createTemplateFromFile('Page');
  htmlOutput.data = columnAData;

  return htmlOutput.evaluate().setTitle('QR Code Web App');
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
function saveQRCodeToDrive(svgData) {
  
  var folderName = "QR Codes";
  var fileName = "qr_code.svg"; //change static filename.svg to get column B from sheets if column G is empty
  
  try {
    // Get the folder by name or create it if it doesn't exist
    var folders = DriveApp.getFoldersByName(folderName);
    var folder;
    
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }
    
    var qrCodeBlob = Utilities.newBlob(svgData, "image/svg+xml", fileName); // Provide a name for the blob
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


