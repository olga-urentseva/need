const fastify = require('fastify')({ logger: true });
const fs = require('fs/promises');
const path = require('path');
const fastifyStatic = require('fastify-static');
const fastifySession = require('fastify-session');
const fastifyCookie = require('fastify-cookie');

fastify.register(require('point-of-view'), {
  engine: {
    pug: require('pug'),
  },
  root: path.join(__dirname, 'views'),
  viewExt: 'pug',
});

fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  secret: 'a secret with minimum length of 32 characters',
  cookie: {
    secure: 'auto',
  },
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
});

// Declare a routes

// fastify.get('/logout', (request, reply) => {});

fastify.get('/', (request, reply) => {
  reply.view('pages/index');
});

fastify.get('/about', (request, reply) => {
  reply.view('pages/about');
});

fastify.get('/rules', (request, reply) => {
  reply.view('pages/rules');
});

fastify.get('/signin', (request, reply) => {
  reply.view('pages/signin');
});

fastify.get('/signup', (request, reply) => {
  reply.view('pages/signup');
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
