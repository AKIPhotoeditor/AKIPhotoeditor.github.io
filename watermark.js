<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"></script>
  <style>
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
    }
    canvas {
      border: 1px solid black;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div id="baseImageInput">
    <label for="baseImageUpload">Upload Base Images:</label>
    <input type="file" id="baseImageUpload" accept="image/*" multiple>
  </div>

  <div id="watermarkInput">
    <label for="watermarkUpload">Upload Watermark:</label>
    <input type="file" id="watermarkUpload" accept="image/*">
  </div>

  <div id="watermarkOptions">
    <label for="watermarkSize">Watermark Size:</label>
    <input type="number" id="watermarkSize" value="100" min="1" max="500">
    
    <label for="watermarkPosition">Watermark Position:</label>
    <select id="watermarkPosition">
      <option value="center">Center</option>
      <option value="upper-left">Upper Left</option>
      <option value="upper-right">Upper Right</option>
      <option value="bottom-left">Bottom Left</option>
      <option value="bottom-right">Bottom Right</option>
    </select>
  </div>

  <button id="downloadWatermarkedImages">Download Watermarked Images</button>

  <canvas id="myCanvas"></canvas>

  <script>
    let baseImages = [];
    let watermarkImage;
    let watermarkSize = 100;
    let watermarkPosition = 'center';

    function setup() {
      noLoop(); // Disable continuous drawing
      // Set up event listeners
      document.getElementById('baseImageUpload').addEventListener('change', handleBaseImageUpload);
      document.getElementById('watermarkUpload').addEventListener('change', handleWatermarkUpload);
      document.getElementById('watermarkSize').addEventListener('input', handleWatermarkSizeChange);
      document.getElementById('watermarkPosition').addEventListener('change', handleWatermarkPositionChange);
      document.getElementById('downloadWatermarkedImages').addEventListener('click', downloadWatermarkedImages);
    }

    function drawImages() {
      if (baseImages.length > 0 && watermarkImage) {
        baseImages.forEach((baseImage, index) => {
          // Set canvas size to match image
          createCanvas(baseImage.width, baseImage.height);
          background(255);
          
          // Draw the base image
          image(baseImage, 0, 0, width, height);

          // Calculate watermark position
          let x, y;
          if (watermarkPosition === 'center') {
            x = (width - watermarkSize) / 2;
            y = (height - watermarkSize) / 2;
          } else if (watermarkPosition === 'upper-left') {
            x = 0;
            y = 0;
          } else if (watermarkPosition === 'upper-right') {
            x = width - watermarkSize;
            y = 0;
          } else if (watermarkPosition === 'bottom-left') {
            x = 0;
            y = height - watermarkSize;
          } else if (watermarkPosition === 'bottom-right') {
            x = width - watermarkSize;
            y = height - watermarkSize;
          }

          // Draw watermark
          image(watermarkImage, x, y, watermarkSize, watermarkSize);

          // Create ZIP entry
          createZip(baseImage, index);
        });
      }
    }

    function handleBaseImageUpload(event) {
      const files = event.target.files;
      if (files.length > 0) {
        baseImages = Array.from(files).map(file => loadImage(URL.createObjectURL(file), drawImages));
      }
    }

    function handleWatermarkUpload(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        watermarkImage = loadImage(URL.createObjectURL(file), drawImages);
      }
    }

    function handleWatermarkSizeChange() {
      watermarkSize = parseInt(document.getElementById('watermarkSize').value, 10);
      drawImages();
    }

    function handleWatermarkPositionChange() {
      watermarkPosition = document.getElementById('watermarkPosition').value;
      drawImages();
    }

    function createZip(baseImage, index) {
      const zip = new JSZip();
      const canvas = document.getElementById('myCanvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size to match base image
      canvas.width = baseImage.width;
      canvas.height = baseImage.height;
      
      // Draw base image and watermark
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(watermarkImage, (canvas.width - watermarkSize) / 2, (canvas.height - watermarkSize) / 2, watermarkSize, watermarkSize);
      
      // Convert canvas to data URL
      const imageBlob = canvas.toDataURL('image/png').split(';base64,').pop();
      
      // Add to ZIP file
      zip.file(`watermarked_image_${index}.png`, imageBlob, { base64: true });
      
      // Generate ZIP file
      zip.generateAsync({ type: 'blob' }).then(blob => {
        saveAs(blob, 'watermarked_images.zip');
      });
    }

    function downloadWatermarkedImages() {
      // Simply trigger ZIP creation for all base images
      if (baseImages.length > 0 && watermarkImage) {
        baseImages.forEach((baseImage, index) => {
          createZip(baseImage, index);
        });
      }
    }
  </script>
</body>
</html>
