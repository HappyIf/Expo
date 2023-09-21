var model;
var input = document.getElementById('imageInput');
var Predict = document.getElementById("pre_btn");

async function load() {
    model = await tf.loadLayersModel('model.json');
}
const imageInput = document.getElementById('imageInput');
let image;
var tfResizedImage;

imageInput.addEventListener('change', function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const img = new Image();

    img.onload = function () {
      // Create a canvas and context
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');

      // Set the desired width and height
      var targetWidth = 96;
      var targetHeight = 96;

      // Resize the image on the canvas
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Get the resized image data as a URL or base64-encoded data
      var resizedImageData = canvas.toDataURL('image/jpeg'); // Change 'image/jpeg' to the desired format

      // 'resizedImageData' now contains the resized image data

      // Convert the resized image data to TensorFlow.js tensor
      var tfImage = tf.browser.fromPixels(canvas); // Convert canvas to TensorFlow.js tensor
       tfResizedImage = tfImage.expandDims(); // Add a batch dimension
      console.log(tfResizedImage);
      // Use 'tfResizedImage' in your TensorFlow.js model
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

async function find() {
    // let file = input.files[0];
  
    // let reader = new FileReader();

	// let tensor = tf.fromPixels(file)
	// .resizeNearestNeighbor([96,96]) // change the image size here
	// .toFloat()
	// .div(tf.scalar(255.0))
	// .expandDims();

    let predictions = await model.predict(tfResizedImage).data();
    console.log(predictions);
  }
  load();