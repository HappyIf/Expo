var model, modelPath = 'model.json', result = document.getElementById("result");
const selectedImage = document.getElementById('inputImage');

async function loadModel() {
  // model = await tf.loadModel('model.json');
  model = await tf.loadLayersModel(modelPath);

  document.getElementById("mAlert").style.display = "none";
  document.getElementById("alert").style.display = "block";
  predictImage(model);
  document.getElementById("selImg").setAttribute("onclick", "openModal()");
}
loadModel();

function uploadImage() {
  const imageInput = document.getElementById('fileUpload');

  // Check if a file is selected
  if (imageInput.files.length === 0) {
      alert('Please select an image file.');
      return;
  }

  // Access the selected file
  const imageFile = imageInput.files[0];

  // You can now work with the selected image file, such as uploading it to a server or processing it with JavaScript.
  // For example, to display the image on the page, you can create an Image object and set its src attribute:
  // const imageElement = new Image();
  selectedImage.src = URL.createObjectURL(imageFile);
  result.innerHTML = "Calculating...";
  closeModal();
  setTimeout(function() {
    predictImage(model);
}, 1000);
  //
  // Append the image to a div or other HTML element to display it
  // const displayDiv = document.createElement('div');
  // displayDiv.appendChild(imageElement);
  // document.body.appendChild(displayDiv);
}

var imageInput = document.getElementById('fileUpload');
        imageInput.addEventListener('change', uploadImage);

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
  var decimalPlaces = 2;
  // Make predictions
  var predictions = model.predict(batchedImage);

  // Convert predictions to a JavaScript array
  var predictionsArray = await predictions.array();
  var value = (predictionsArray * 100).toFixed(decimalPlaces);//[0][0];
  // console.log(value*100);
  let resultMessage = '';
  if (value >= 60) {
    resultMessage = `Tuberculosis <i style='color: red;'>positive</i>`;
  } else {
    resultMessage = `Tuberculosis <i style='color: green;'>negative</i>`;
  }
  result.innerHTML = resultMessage+`<br><br>TB presence Percent : ${value} %`;//value + " %";

  console.log(value);
}

// Function to handle image selection
function selectImage(imageUrl) {
  selectedImage.src = imageUrl;
  predictImage(model);
  closeModal();
}

// Function to open the modal with animation and update history
function openModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = 'block';
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);

  // Push a state to the browser's history when the modal is opened
  window.history.pushState({ modal: 'open' }, 'Modal Open', '#modal');
}

// Function to close the modal with animation and update history
function closeModal() {
  const modal = document.getElementById('myModal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300); // Wait for the transition to complete before hiding

  // Push a state to the browser's history when the modal is closed
  window.history.pushState({ modal: 'close' }, 'Modal Close', './');
}

// Event listener to handle browser back button
window.addEventListener('popstate', function(event) {
  const modal = document.getElementById('myModal');
  if (event.state && event.state.modal === 'open') {
    openModal();
  } else {
    closeModal();
  }
});

const loadMoreButton = document.getElementById('loadMoreButton');
loadMoreButton.addEventListener('click', loadMoreImages);

// List of image URLs (replace with your image URLs)
const imageUrls = ['Normal-2177.png',
  'Tuberculosis-619.png', 'Tuberculosis-506.png',
  'Normal-1656.png', 'Tuberculosis-588.png',
  'Normal-3270.png', 'Normal-1568.png',
  'Normal-1659.png', 'Normal-3348.png',
  'Tuberculosis-63.png', 'Tuberculosis-483.png',
  'Tuberculosis-590.png',
  'Normal-836.png', 'Tuberculosis-105.png',
  'Tuberculosis-495.png', 'Tuberculosis-222.png',
  'Tuberculosis-572.png', 'Normal-1432.png',
  'Tuberculosis-191.png', 'Tuberculosis-664.png',
  'Normal-1698.png', 'Tuberculosis-492.png',
  'Tuberculosis-35.png', 'Normal-347.png',
  'Tuberculosis-137.png', 'Tuberculosis-512.png',
  'Normal-2618.png', 'Normal-783.png',
  'Tuberculosis-408.png', 'Normal-3181.png',
  'Normal-1097.png', 'Tuberculosis-486.png',
  'Normal-1757.png', 'Normal-701.png',
  'Normal-593.png', 'Tuberculosis-669.png',
  'Normal-2357.png', 'Normal-1156.png',
  'Normal-3296.png', 'Tuberculosis-199.png'
]

// Function to shuffle the image URLs randomly
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Shuffle the image URLs
shuffleArray(imageUrls);

const limit = 10; // Set your limit here

let loadedImagesCount = 0;

function loadMoreImages() {
  const imageList = document.querySelector('.image-list');

  // Calculate the index of the last image to load
  const endIndex = Math.min(loadedImagesCount + limit, imageUrls.length);

  // Load images up to the limit
  for (let i = loadedImagesCount; i < endIndex; i++) {
    const imageUrl = "Images/" + imageUrls[i];
    const listItem = document.createElement('li');
    listItem.className = 'image-list-item';
    listItem.setAttribute("onclick", `selectImage('${imageUrl}')`);
    listItem.innerHTML = `
    <div class="skeleton-image">
    <img class="image-thumbnail" src="Tuberculosis-171.png" style=" opacity: 0;">
    </div>
    `;

    // Create an Image element to load the actual image
    var imgElement = new Image();
    imgElement.opacity = 0;
    imgElement.src = imageUrl;
    imgElement.alt = `Image ${i + 1}`;
    listItem.appendChild(imgElement);
    imgElement.className = 'image-thumbnail';


    // Add an event listener to replace the skeleton with the loaded image
    imgElement.addEventListener('load', () => {
      const skeletonImage = listItem.querySelector('.skeleton-image');
      if (skeletonImage) {
        listItem.removeChild(skeletonImage);
        //listItem.appendChild(imgElement);
        imgElement.opacity = 1;
      }
    });
    imageList.appendChild(listItem);
    loadedImagesCount++;
  }

  // Disable the "Load More" button when all images are loaded
  if (loadedImagesCount === imageUrls.length) {
    loadMoreButton.disabled = true;
  }
}

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadMoreImages();
    }
  });
}, options);

// Start observing the button
observer.observe(loadMoreButton);