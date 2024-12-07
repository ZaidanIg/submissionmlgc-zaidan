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
 
        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `${response.message}`
            })
            newResponse.code(response.statusCode)
            return newResponse;
        }
 
        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            })
            newResponse.code(response.output.statusCode)
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