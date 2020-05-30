const argon2 = require('argon2'); // hashing
const knex = require('knex')(require('../../knexfile'));
const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  debug: true,
  logger: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function sendEmail(email) {
  const emailMessage = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'The Need. Activation link',
    text: 'Hello! This is your activation link: .',
  };
  transport.sendMail(emailMessage, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}

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
  sendEmail(email);
  return reply.redirect('/signin');
};

exports.showSignin = function (request, reply) {
  reply.render('pages/signin');
};

exports.showSignup = function (request, reply) {
  reply.render('pages/signup');
};
