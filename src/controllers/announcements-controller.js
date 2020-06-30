const knex = require('../knex');
const mailer = require('../mailer');

exports.askHelp = async function (request, reply) {
  const descriptionOfAnnouncement = request.body;
  if (!descriptionOfAnnouncement.help_description) {
    request.flash('info', 'Please, enter the text of your announcement');
    reply.redirect('/helpto');
    return reply;
  }
  await knex('announcements').insert({
    user_id: request.currentUser.id,
    description: descriptionOfAnnouncement.help_description,
  });
  request.flash(
    'info',
    'You have successfully added a new announcement. It is perfect time to help others'
  );
  reply.redirect('/announcements');
  return reply;
};

exports.showAskHelp = function (request, reply) {
  if (!request.currentUser) {
    request.flash('info', `You have to Sign in`);
    reply.redirect('/signin');
    return reply;
  }
  reply.render('pages/askhelp');
};

exports.showAnnouncements = async function (request, reply) {
  if (!request.currentUser) {
    request.flash('info', `You have to Sign in`);
    reply.redirect('/signin');
    return reply;
  }
  const rowsOfAnnouncements = await knex('announcements');
  console.log(rowsOfAnnouncements);
  reply.render('pages/helpto', { rows: rowsOfAnnouncements });
  return reply;
};

exports.showHelpToForm = function (request, reply) {
  if (!request.currentUser) {
    request.flash('info', `You have to Sign in`);
    reply.redirect('/signin');
    return reply;
  }
  console.log(request.params);
  return reply.render('pages/helptoform', { id: request.params.id });
};

exports.helpToForm = async function (request, reply) {
  if (!request.currentUser) {
    request.flash('info', `You have to Sign in`);
    reply.redirect('/signin');
    return reply;
  }
  const { input_place_phone: phoneNumber, input_place: message } = request.body;
  const announcementId = request.params.id;
  const rowAnnouncements = await knex('announcements').where({
    id: announcementId,
  });
  const userIdAsked = rowAnnouncements[0].user_id;
  const rowUsers = await knex('users').where({ id: userIdAsked });
  mailer.send(
    rowUsers[0].email,
    'The Need: someone want to help you',
    'Person ' +
      request.currentUser.last_name +
      ' ' +
      request.currentUser.name +
      ' responded to your announcement with the following message: ' +
      message +
      '. Phone number: ' +
      phoneNumber
  );
  reply.render('pages/help-final', { user: request.currentUser });
  return reply;
};

// exports.showFinal = function (request, reply) {
//   if (!request.currentUser) {
//     request.flash('info', `You have to Sign in`);
//     return reply.redirect('/signin');
//   }
//   return reply.render('/pages/help-final', { user: request.currentUser });
// };
