<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>QR Code Styling</title>
    <script type="text/javascript" src="https://unpkg.com/qr-code-styling@1.5.0/lib/qr-code-styling.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        #canvas {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh; /* Optionally, set the desired height */
        }
    </style>
</head>
<body>
    <div id="canvas"></div>
    <script type="text/javascript">
    google.script.run.withSuccessHandler(() => generateQR(counter)).doGet();

    function waitForCanvasToLoad(callback) {
        var interval = setInterval(function() {
            var canvasElement = document.querySelector("#canvas canvas");
            if (canvasElement) {
                clearInterval(interval); // Stop checking
                callback(canvasElement);
            }
        }, 100); // Check every 100 milliseconds
    }

    let counter = 0;
    let data = "<?= data ?>";
    const dataArray = data.split(",");

    function generateQR(number) {
      console.log(dataArray);
      const qrCode = new QRCodeStyling({
        width: 600,
        height: 600,
        type: "canvas",
        data: dataArray[number], // Use the counter to dynamically access data
        image: "https://i.ibb.co/ZzBFw8k/birb.png",
        dotsOptions: {
          color: "#000000",
          type: "rounded"
        },
        backgroundOptions: {
          color: "#ffffff",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 10
        }
      });

      qrCode.append(document.getElementById("canvas"));
      waitForCanvasToLoad(passQRToSave);
    }

    function passQRToSave(canvasElement) {
        if (canvasElement) {
            var img = canvasElement.toDataURL('image/png');
            // The rest of your code
            google.script.run.withSuccessHandler(onSavedToDrive).saveQRCodeToDrive(img);
        } else {
            alert("QR code not found. Please generate the QR code first.");
        }
    }

    function onSavedToDrive(fileName) {
        alert("QR code saved to Google Drive as " + fileName);
        $('#canvas').empty();
        generateNextQR(); // Initiate the process to generate the next QR
    }
  
    function generateNextQR() {
      counter++;
      google.script.run.withSuccessHandler(() => generateQR(counter)).doGet();
    }
    </script>
</body>
</html>
