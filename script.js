var model, modelPath='model.json', result=document.getElementById("result");
async function loadModel() {
// model = await tf.loadModel('model.json');
 model = await tf.loadLayersModel(modelPath);

 predictImage(model);
}
loadModel();
async function showFile(input) {
    let file = input.files[0];
  
    let reader = new FileReader();

	let tensor = tf.fromPixels(file)
	.resizeNearestNeighbor([96,96]) // change the image size here
	.toFloat()
	.div(tf.scalar(255.0))
	.expandDims();

    let predictions = await model.predict(tensor).data();
    console.log(predictions[0]);
  }

function preProcess() {
  // Assuming you have an HTML image element with an id of 'inputImage'
var imageElement = document.getElementById('inputImage');

// Create a TensorFlow.js tensor from the image
var tfImage = tf.browser.fromPixels(imageElement);

// Resize the image to match the expected input shape (96x96)
var resizedImage = tf.image.resizeBilinear(tfImage, [96, 96]);

// Normalize the pixel values to the range [0, 1]
var normalizedImage = resizedImage.div(255);
return normalizedImage;
}

async function predictImage(model) {
  var normalizedImage = preProcess();
  // Expand dimensions to match the expected input shape (add a batch dimension)
  var batchedImage = normalizedImage.expandDims(0);

  // Make predictions
  var predictions = model.predict(batchedImage);

  // Convert predictions to a JavaScript array
  var predictionsArray = await predictions.array();
  var value = predictionsArray[0][0];
  // console.log(value*100);
  result.innerHTML= value*100+"%";
}

        // Function to handle image selection
        function selectImage(imageUrl) {
          const selectedImage = document.getElementById('inputImage');
          selectedImage.src = imageUrl;
          predictImage(model);
          closeModal();
      }

              // Function to open the modal
              function openModal() {
                const modal = document.getElementById('myModal');
                modal.style.display = 'block';
            }
    
            // Function to close the modal
            function closeModal() {
                const modal = document.getElementById('myModal');
                modal.style.display = 'none';
            }