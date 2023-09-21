var model;
var input = document.getElementById("input");
var Predict = document.getElementById("pre_btn");

input.click(async function () {
    model = await tensorflow.loadLayersModel('model.json');
})

Predict.click(async function () {
    let file = input.files[0];
  
    let reader = new FileReader();

	let tensor = tensorflow.fromPixels(file)
	.resizeNearestNeighbor([96,96]) // change the image size here
	.toFloat()
	.div(tf.scalar(255.0))
	.expandDims();

    let predictions = await model.predict(tensor).data();
    console.log(predictions);
  });