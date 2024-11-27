const { Firestore } = require('@google-cloud/firestore');
const predictClassification = require('../services/inferenceService');
const storeData = require('../services/storeData');
const crypto = require('crypto');
const InputError = require('../exceptions/InputError');

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    try {
        const { confidenceScore, label, suggestion } = await predictClassification(model, image);

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const history = {
            id,
            result: label,
            suggestion,
            createdAt,
        };

        await storeData(id, history);

        return h
            .response({
                status: 'success',
                message: 'Model is predicted successfully',
                data: history,
            })
            .code(201);
    } catch (error) {
        if (error.name === 'InputError') {
            return h
                .response({
                    status: 'fail',
                    message: error.message,
                })
                .code(400);
        }
        return h
            .response({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
            })
            .code(500);
    }
}

async function getHistoriesHandler(request, h) {
    try {
        const db = new Firestore({
            projectId: process.env.PROJECT_ID,
            databaseId: process.env.DATABASE_ID
        });
        
        const predictionsRef = db.collection('predictions');
        const snapshot = await predictionsRef.get();
        
        const histories = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                history: {
                    result: data.result,
                    createdAt: data.createdAt,
                    suggestion: data.suggestion,
                    id: doc.id
                }
            };
        });

        return h.response({
            status: 'success',
            data: histories
        }).code(200);
    } catch (error) {
        console.error("Error fetching predictions history: ", error.message);
        return h
            .response({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
            })
            .code(500);
    }
}

module.exports = { postPredictHandler, getHistoriesHandler };