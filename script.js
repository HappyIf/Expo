model = await tf.loadModel('HappyIf/Expo/TB/model/model.json');
function showFile(input) {
    let file = input.files[0];
  
    let reader = new FileReader();

	let tensor = tf.fromPixels(file)
	.resizeNearestNeighbor([96,96]) // change the image size here
	.toFloat()
	.div(tf.scalar(255.0))
	.expandDims();

    let predictions = await model.predict(tensor).data();
    console.log(predictions);
  }