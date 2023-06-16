import * as tf from '@tensorflow/tfjs';
const modelUrl = "http://localhost:3001/model.json"

async function classifyImage(image) {
  const img = tf.browser.fromPixels(image);
  const resizedImg = tf.image.resizeBilinear(img, [64,64]);
  const expandedImg = resizedImg.expandDims(0);
  const preprocessedImg = expandedImg.toFloat().div(255);

  const model = await tf.loadLayersModel(modelUrl);
  const predictions = await model.predict(preprocessedImg).data();

  return Array.from(predictions);
}

export default classifyImage;
