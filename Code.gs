var sheet = SpreadsheetApp.openById("1zjYYp1ICi0a07Qc61y6nqZlyPLkm5ygVuCh7OOT1Q3U").getSheetByName("Sheet9"); // Replace with your sheet name

function doGet() {
  var columnAData = getAndPassColumnAData();
  // Create HTML output with data
  var htmlOutput = HtmlService.createTemplateFromFile('Page');
  htmlOutput.data = columnAData;
  return htmlOutput.evaluate().setTitle('QR Code Web App');
}

function getAndPassColumnAData() {
  var data = sheet.getRange("B:I").getValues();

  var columnAData = [];
  
  for (var i = 1; i < data.length; i++) { // Assuming the first row is headers
    var name = data[i][1] + " " + data[i][2] + " " + data[i][0]; // Column B (index 1)
    var code = data[i][6]; // Column G (index 6)
    var link = data[i][7]; // Column H (index 7)
    
    if (code && !link) { // If column G is not empty and column H is empty
      var pair = []
      pair.push(name, code, i + 1); // Push name, code, row number, and society
      columnAData.push(pair);
    }
  }
  return columnAData;
}


////////
function checkFolders(folderNames) {
  var createdFolders = [];

  for (var i = 0; i < folderNames.length; i++) {
    var folderName = folderNames[i];
    var folder = getFolder(folderName);

    if (!folder) {
      folder = DriveApp.createFolder(folderName);
      createdFolders.push(folderName);
      // Optionally, perform additional setup for the newly created folder
    }
  }

  return createdFolders;
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
      var imageUrl = file.getUrl(); // Get the URL of the saved image

      // Set the link in the sheet instead of "DONE"
      sheet.getRange(qrCodeImages[i].Row, 9).setValue(imageUrl);
  }
}

async function saveToDrive(qrArray){ // to save to drive
  var folderName = folderName;
  var qrCodeImages = qrCodeImages;
  var folder = DriveApp.getFolderById("1eQiES8R6p5ASdY56K16ZkqG0YoetUXlH"); // to prepare folder
  var qrCodeImages = generateFile(qrArray);
  upload(folder, qrCodeImages);
}
