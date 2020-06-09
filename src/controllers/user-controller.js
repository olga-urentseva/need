const argon2 = require('argon2'); // hashing
const knex = require('../knex');
const mailer = require('../mailer');

exports.signup = async function (request, reply) {
  const {
    email,
    name,
    last_name: lastName,
    password,
    password_confirmation: passwordConfirmation,
  } = request.body;

  if (password !== passwordConfirmation) {
    return reply.render('pages/signup', {
      errorMessage: 'Password and password confirmation must be the same',
    });
  }
  const isEmailTaken =
    (await knex('users').where({ email: email }).select('email')).length > 0;
  const hash = await argon2.hash(password); // hashing password
  if (isEmailTaken) {
    return reply.render('pages/signup', {
      errorMessage:
        'This email already taken. Please choose another one or use this email to sign in.',
    });
  }
  await knex('users').insert({
    email,
    name,
    last_name: lastName,
    password: hash,
  });
  request.flash(
    'info',
    `The email with activation link has been sent to ${email}. Please check mailbox.`
  );
  mailer.send(
    email,
    'The Need: activation link',
    'This is your actvation link'
  );
  return reply.redirect('/signin');
};

exports.signin = async function (request, reply) {
  request.session.delete();
  const { email, password } = request.body;
  if (email == ' ' || password == ' ') {
    return reply.render('pages/signin', {
      errorMessage: 'Please enter login and password',
    });
  }
  const rowsFromDb = await knex('users').where({ email }).select('password');
  if (
    rowsFromDb.length === 0 ||
    argon2.verify(rowsFromDb[0], password) === false
  ) {
    return reply.render('pages/signin', {
      errorMessage: 'You entered the wrong email or password',
    });
  }
  const session = request.session.get('data');
  await knex('users').insert({ user_id: session }).where({ email });
  return reply.redirect('/');
};

exports.logout = function (request, reply) {
  request.session.delete();
  reply.render('pages/index');
};

exports.showSignin = function (request, reply) {
  reply.render('pages/signin');
};

exports.showSignup = function (request, reply) {
  reply.render('pages/signup');
};