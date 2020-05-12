const fastify = require('fastify')({ logger: true });
const fs = require('fs/promises');
const path = require('path');
const fastifyStatic = require('fastify-static');

fastify.register(require('point-of-view'), {
  engine: {
    pug: require('pug'),
  },
  root: path.join(__dirname, 'views'),
  viewExt: 'pug',
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
});

// Declare a route
fastify.get('/', (request, reply) => {
  reply.view('pages/index', { text: 'text' });
});

fastify.get('/about', (request, reply) => {
  reply.view('pages/about', { text: 'text' });
});

fastify.get('/rules', (request, reply) => {
  reply.view('pages/rules', { text: 'text' });
});

fastify.setNotFoundHandler((request, reply) => {
  reply.status(404).view('pages/not-found');
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
