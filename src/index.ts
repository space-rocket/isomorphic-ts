/// <reference path="../typings/tsd.d.ts" />

import * as Hapi from 'hapi';

const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

server.route({
    method: 'GET',
    path:'/hello/{name}', 
    handler: function (request, reply) {

        return reply('hello ' + request.params['name']);
    }
});

server.start((err) => {
    if (err) { throw err; }
    console.log('Server running at:', server.info.uri);
});

