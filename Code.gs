function doGet() {
  return HtmlService.createHtmlOutputFromFile('Page')
      .setTitle('QR Code Web App');
}

function saveQRCodeToDrive(svgData) {
  var folderName = "QR Codes"; // variable for foldername
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); // get active spreadsheet
    var data = sheet.getRange("A:B").getValues(); //getting range from column a - b
    
    for (var i = 1; i < data.length; i++) { // looping iteration for getting each row
      var cellB = data[i][1]; // setting current row - column as cellB

      if (cellB) { // Check if column B has a value
        var filenameFromColumnB = cellB + ".svg"; // Use column B value as filename
        var folders = DriveApp.getFoldersByName(folderName); //appending foldername
        var folder;

        if (folders.hasNext()) { // if there is a folder with the name from variable folderName
          folder = folders.next(); // open the folder and perform operation
        } else { // else
          folder = DriveApp.createFolder(folderName); // create a folder with the folder name
        }

        var qrCodeBlob = Utilities.newBlob(svgData, "image/svg+xml", filenameFromColumnB); // passing the folder name from column B
        var file = folder.createFile(qrCodeBlob);

        // Set sharing permissions
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

        // Mark the current row as "Done" in column G
        sheet.getRange(i + 1, 7).setValue("Done");
      }
    }
    
    return "Files saved successfully.";
  } catch (error) {
    return "Error: " + error.toString();
  }
}
