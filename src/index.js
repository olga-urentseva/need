require('dotenv').config({ path: '../.env' });

const fastify = require('fastify')({ logger: true });
const fs = require('fs/promises');
const path = require('path');
const fastifyStatic = require('fastify-static');
const fastifyFormBody = require('fastify-formbody'); // body of http request
const fastifySession = require('fastify-secure-session');
const fastifyFlash = require('fastify-flash');

const knex = require('./knex');

const pagesController = require('./controllers/pages-controller.js');
const userController = require('./controllers/user-controller.js');

fastify.register(require('point-of-view'), {
  engine: {
    pug: require('pug'),
  },
  root: path.join(__dirname, 'views'),
  viewExt: 'pug',
});

fastify.register(fastifySession, {
  secret: process.env.SESSION_KEY,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  },
});

fastify.register(fastifyFlash);

fastify.register(fastifyFormBody);

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
});

fastify.decorateRequest('currentUser', null);

fastify.addHook('preHandler', async (req) => {
  const userId = req.session.get('userId');
  if (!userId) {
    return;
  }
  const userInfo = await knex('users').where({ user_id: userId });
  if (userInfo.length > 0) {
    req.currentUser = userInfo[0];
  }
});

fastify.decorateReply('render', function (view, data = {}) {
  this.view(view, {
    currentUser: this.request.currentUser,
    getFlashes: (...args) => this.flash(...args),
    ...data,
  });
});

fastify.get('/', pagesController.index);

fastify.get('/about', pagesController.about);

fastify.get('/rules', pagesController.rules);

fastify.get('/signin', userController.showSignin);

fastify.get('/signup', userController.showSignup);

fastify.get('/profile', userController.showProfile);

fastify.get('/termofuse', pagesController.termofuse);

fastify.get('/askhelp', userController.showAskHelp);

fastify.get('/logout', userController.logout);

fastify.get('/helpto', userController.showHelpTo);

fastify.post('/signup', userController.signup);

fastify.post('/signin', userController.signin);

fastify.post('/profile', userController.changeProfileInfo);

fastify.post('/askhelp', userController.askHelp);

fastify.post('/helpto', userController.helpTo);

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
