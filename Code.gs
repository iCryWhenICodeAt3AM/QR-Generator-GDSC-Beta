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

function saveQRCodeToDrive(svgData) {
  
  var folderName = "QR Codes"; // default foldername

  // to be made: tentative for loop to get range from B to G, then check if B has value and G has none; True: fileName = columnB.value + ".svg", False: Skip
  var fileName = "qr_code.svg"; // default fileName
  
  try {
    // Get the folder by name or create it if it doesn't exist
    var folders = DriveApp.getFoldersByName(folderName); //checking if the folder exists in the drive
    var folder; // variable for folder
    
    if (folders.hasNext()) { // if there is a folder then perform next operation
      folder = folders.next(); // open the folder and perform operation
    } else {
      folder = DriveApp.createFolder(folderName); // create a folder
    }
    
    var qrCodeBlob = Utilities.newBlob(svgData, "image/svg+xml", fileName); // filename to be dynamic
    var file = folder.createFile(qrCodeBlob); // creating the file with the information and svg
    
    // Set sharing permissions
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); 
    
     // Find the row with data in column F but no data in column G
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); // Modify this to target a specific sheet
    var data = sheet.getRange("F:G").getValues();
    
    for (var i = 1; i < data.length; i++) { // Assuming the first row is headers
      var cellF = data[i][0];
      var cellG = data[i][1];
      
      if (cellF && !cellG) { // If column A is not empty and column B is empty
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


