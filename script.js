document.getElementById('upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function() {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas dimensions to match image
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the image onto the canvas
            ctx.drawImage(img, 0, 0);

            // Add watermark text
            ctx.font = '40px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // White color with 50% opacity
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Calculate position for watermark text
            const x = canvas.width / 2;
            const y = canvas.height / 2;
            const watermarkText = 'Your Watermark';

            ctx.fillText(watermarkText, x, y);

            // Optionally, add more watermarking features like images
        };
    };

    reader.readAsDataURL(file);
});
