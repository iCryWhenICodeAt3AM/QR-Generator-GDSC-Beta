function testScrnShot() {
    html2canvas(document.getElementById("testing"), {
        onrendered: function (canvas) {
            document.body.appendChild(canvas);            
            var dataURL = canvas.toDataURL();
            console.log(dataURL);
        }
    });
}

const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "canvas",
    data: "56980e9710bc166a627c143858c4b0d16a07560849aaa2b2d3eeeab51f5847d0", // Use the counter to dynamically access data
    image: "birb.svg",
    dotsOptions: {
      color: "#000000",
      type: "dots",
      errorCorrectionLevel: 'L'
    },
    cornersSquareOptions:{
        type:"extra-rounded"
    },
    cornersDotOptions:{
        type:"dot"
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 10
    },
    cornersSquareOptions:{
        type:"extra-rounded",
        color:"#000000"
      },
  });

  qrCode.append(document.getElementById("testing"));

  var elem = document.createElement("img");
    elem.setAttribute("src", "template.png");
    elem.setAttribute("height", "768");
    elem.setAttribute("width", "1024");
    elem.setAttribute("alt", "Template");
  document.getElementById("testing").appendChild("elem");