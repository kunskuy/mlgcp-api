const handlers = require('./handler');

const routes = [
    {
        path: '/predict',
        method: 'POST',
        handler: handlers.postPredictHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                maxBytes: 1000000,
                multipart: true,
                failAction: (request, h, err) => {
                    return h
                        .response({
                            status: 'fail',
                            message: 'Payload content length greater than maximum allowed: 1000000'
                        })
                        .code(413)
                        .takeover();
                }
            },
        },
    },
    {
        path: '/predict/histories',
        method: 'GET',
        handler: handlers.getHistoriesHandler,
    },
];

module.exports = routes;