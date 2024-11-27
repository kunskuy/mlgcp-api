const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    try {
        const modelPath = process.env.MODEL_URL;
        return await tf.loadGraphModel(modelPath);
    } catch (error) {
        throw new Error('Gagal memuat model: ' + error.message);
    }
}

module.exports = loadModel;