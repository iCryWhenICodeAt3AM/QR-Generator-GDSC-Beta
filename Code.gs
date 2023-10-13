function doGet() {
  return HtmlService.createHtmlOutputFromFile('Page')
      .setTitle('QR Code Web App');
}

function saveQRCodeToDrive(svgData) {
  var folderName = "QR Codes";
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getRange("A:B").getValues();
    
    for (var i = 1; i < data.length; i++) {
      var cellB = data[i][1];

      if (cellB) { // Check if column B has a value
        var filenameFromColumnB = cellB + ".svg"; // Use column B value as filename
        var folders = DriveApp.getFoldersByName(folderName);
        var folder;

        if (folders.hasNext()) {
          folder = folders.next();
        } else {
          folder = DriveApp.createFolder(folderName);
        }

        var qrCodeBlob = Utilities.newBlob(svgData, "image/svg+xml", filenameFromColumnB);
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
