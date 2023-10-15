var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1"); // Replace with your sheet name
var qrCodeImages = [];

function doGet() {
  var columnAData = getAndPassColumnAData();
  // Create HTML output with data
  var htmlOutput = HtmlService.createTemplateFromFile('Page');
  htmlOutput.array = qrCodeImages;
  htmlOutput.data = columnAData;
  return htmlOutput.evaluate().setTitle('QR Code Web App');
}

function getAndPassColumnAData() {
  var cellB = sheet.getRange("B:B").getValues(); // Get all values in column B
  var data = sheet.getRange("F:G").getValues();
  var columnAData = [];
  
  for (var i = 1; i < data.length; i++) { // Assuming the first row is headers
    var cellF = data[i][0];
    var cellG = data[i][1];
    
    if (cellF && !cellG) { // If column A is not empty and column B is empty
      var pair = []
      pair.push(cellB[i], cellF, i + 1);
      columnAData.push(pair);
    }
  }
  return columnAData;
}

////////
function checkFolder(folderName){ // to prepare folder
  var folders = DriveApp.getFoldersByName(folderName);

  if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }
  return folder;
}

function generateFile(qrArray) {
  try {
    var newQRArray = qrArray;
    var qrCodeImages = []; // Define a local array for this function

    for (var i = 0; i < newQRArray.length; i++) {
      var qrCodeBlob = Utilities.newBlob(
        Utilities.base64Decode(newQRArray[i].Canvas.split(',')[1]),
        'image/png',
        newQRArray[i].Name+".png"
      );

      qrCodeImages.push({ Image: qrCodeBlob, Row: newQRArray[i].Row });
    }
    
    return qrCodeImages; // Return the local array
  } catch (error) {
    throw new Error("Error creating files: " + error.toString());
  }
}

function upload(folder, qrCodeImages){
  
  for (var i = 0; i < qrCodeImages.length; i++) {
      var qrCode = qrCodeImages[i].Image;
      var file = folder.createFile(qrCode);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      sheet.getRange(qrCodeImages[i].Row, 7).setValue("DONE"); //Mark as Done
    }
}

async function saveToDrive(folderName, qrArray){ // to save to drive
  var folderName = folderName;
  var qrCodeImages = qrCodeImages;
  var folder = checkFolder(folderName); // to prepare folder
  var qrCodeImages = generateFile(qrArray);
  upload(folder, qrCodeImages);
}
