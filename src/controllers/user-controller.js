const argon2 = require('argon2');
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
    reply.render('pages/signup', {
      errorMessage: 'Password and password confirmation must be the same',
    });
    return reply;
  }
  const isEmailTaken =
    (await knex('users').where({ email: email }).select('email')).length > 0;
  const hash = await argon2.hash(password);
  if (isEmailTaken) {
    reply.render('pages/signup', {
      errorMessage:
        'This email already taken. Please choose another one or use this email to sign in.',
    });
    return reply;
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
  reply.redirect('/signin');
  return reply;
};

exports.signin = async function (request, reply) {
  const { email, password } = request.body;
  if (email == ' ' || password == ' ') {
    reply.render('pages/signin', {
      errorMessage: 'Please enter login and password',
    });
    return reply;
  }
  const rowsFromDb = await knex('users').where({ email });

  if (
    rowsFromDb.length === 0 ||
    !(await argon2.verify(rowsFromDb[0].password, password))
  ) {
    reply.render('pages/signin', {
      errorMessage: 'You entered the wrong email or password',
    });
    return reply;
  }
  const user = rowsFromDb[0];
  request.session.set('userId', user.user_id);
  reply.redirect('/');
  return reply;
};

exports.changeProfileInfo = async function (request, reply) {
  const {
    current_password: currentPassword,
    new_password: newPassword,
    password_confirmation: passwordConfirmation,
  } = request.body;
  if (newPassword != passwordConfirmation) {
    reply.render('pages/profile', {
      errorMessage: 'New Password and Password Confirmation must be the same.',
    });
    return reply;
  }
  const isPasswordsMatches = await argon2.verify(
    request.currentUser.password,
    currentPassword
  );
  if (!isPasswordsMatches) {
    reply.render('pages/profile', {
      errorMessage: 'Your Current password does not match.',
    });
    return reply;
  }

  const newHashPassword = await argon2.hash(newPassword);
  await knex('users')
    .where({ email: request.currentUser.email })
    .update({ password: newHashPassword });
  request.flash('info', 'You have successfully changed your password');
  reply.redirect('/profile');
  return reply;
};

exports.askHelp = async function (request, reply) {
  const descriptionOfAnnouncement = request.body;
  if (!descriptionOfAnnouncement) {
    request.flash('info', 'Please, enter the text of your announcement');
    reply.redirect('/helpto');
    return reply;
  }
  await knex('announcements').insert({
    user_id: request.currentUser.usesr_id,
    description: descriptionOfAnnouncement,
  });
  request.flash(
    'info',
    'You have successfully added a new announcement. It is perfect time to help others'
  );
  reply.redirect('/');
  return reply;
};

exports.helpTo = function (request, reply) {};

exports.logout = function (request, reply) {
  request.session.delete();
  return reply.redirect('/');
};

exports.showSignin = function (request, reply) {
  reply.render('pages/signin');
};

exports.showSignup = function (request, reply) {
  reply.render('pages/signup');
};

exports.showProfile = function (request, reply) {
  if (!request.currentUser) {
    return reply.redirect('/');
  }
  reply.render('pages/profile');
};

exports.showAskHelp = function (request, reply) {
  if (!request.currentUser) {
    request.flash('info', `You have to Sign in`);
    return reply.redirect('/signin');
  }
  reply.render('pages/askhelp');
};

exports.showHelpTo = async function (request, reply) {
  if (!request.currentUser) {
    request.flash('info', `You have to Sign in`);
    reply.redirect('/signin');
    return reply;
  }
  const rowsOfAnnouncements = await knex('announcements').select('description');
  reply.render('pages/helpto', { rows: rowsOfAnnouncements });
  return reply;
};
