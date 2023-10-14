const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    // Define a request extension to handle 'clientError'
    server.ext('onRequest', (request, h) => {
        request.raw.req.on('clientError', (err) => {
            console.error('Client error:', err);

            // Use the 'destroy' method on the underlying socket to close it
            request.raw.req.socket.destroy();

            // Respond with an error message
            return h.response('Client error occurred').code(500);
        });

        return h.continue;
    });

    server.route(routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

// process.on('unhandledRejection', (err) => {
//     console.log(err);
//     process.exit(1);
// });

init();
