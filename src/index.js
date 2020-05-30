require('dotenv').config({ path: '../.env' });

const fastify = require('fastify')({ logger: true });
const fs = require('fs/promises');
const path = require('path');
const fastifyStatic = require('fastify-static');
const fastifySession = require('fastify-secure-session');
const fastifyFormBody = require('fastify-formbody'); // body of http request
const fastifyFlash = require('fastify-flash');

const pagesController = require('./controllers/pages-controller.js');
const userController = require('./controllers/user-controller.js');

//build connection with db

fastify.register(require('point-of-view'), {
  engine: {
    pug: require('pug'),
  },
  root: path.join(__dirname, 'views'),
  viewExt: 'pug',
});

fastify.register(fastifySession, {
  secret: 'averylogphlasebiggerthanthirtstwochars',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  },
});

fastify.register(fastifyFlash);

fastify.register(fastifyFormBody);

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
});

fastify.decorateReply('render', function (view, data = {}) {
  this.view(view, { getFlashes: (...args) => this.flash(...args), ...data });
});

fastify.get('/', pagesController.index);

fastify.get('/about', pagesController.about);

fastify.get('/rules', pagesController.rules);

fastify.get('/signin', userController.showSignin);

fastify.get('/signup', userController.showSignup);

fastify.post('/signup', userController.signup);

// fastify.post('/signin', userController.signin);

fastify.setNotFoundHandler((request, reply) => {
  reply.status(404).render('pages/not-found');
});

fastify.setErrorHandler((error, request, reply) => {
  console.error(error);
  reply.status(500).render('pages/server-error');
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
