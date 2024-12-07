const routes = require('./routes.js')
require('dotenv').config();
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

const Hapi = require('@hapi/hapi');

(async () => {
    const server = Hapi.server({
        host: process.env.HOST,
        port: process.env.PORT || 3000,
        routes: {
            cors: {
                origin: [ "*" ],
            }
        }
    });

    const model = await loadModel();
    
    server.app.model = model;

    server.route(routes);

    server.ext('onPreResponse', function (request, h) {
        
        const response = request.response;

        if (response.isBoom && response.output.statusCode === 413) {
            const newResponse = h.response({
                status: 'fail',
                message: 'Payload content length greater than maximum allowed: 1000000',
            });
                        
            newResponse.code(413);
            return newResponse;
        }

        if (response instanceof InputError || response.isBoom) {
            const statusCode = response instanceof InputError ? response.statusCode : response.output.statusCode;
            const newResponse = h.response({
                status: 'fail',
                message: 'Terjadi kesalahan dalam melakukan prediksi',
            });

            newResponse.code(parseInt(statusCode));
            return newResponse;
        }

        return h.continue;
    });

    // server.ext('onPreResponse', function (request, h) {
    //     const response = request.response;
    //     if (response instanceof InputError) {
    //         const newResponse = h.response({
    //             status: 'fail',
    //             message: `${response.message} Silakan gunakan foto lain.`
    //         })
    //         newResponse.code(response.statusCode)
    //         return newResponse;
    //     }
    //     if (response.isBoom) {
    //         const newResponse = h.response({
    //             status: 'fail',
    //             message: response.message
    //         })
    //         newResponse.code(response.statusCode)
    //         return newResponse;
    //     }
    //     return h.continue;
    // });
 

    await server.start();
    console.log(`Server run at: ${server.info.uri}`);
})();