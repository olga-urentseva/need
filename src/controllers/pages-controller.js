exports.index = function (request, reply) {
  reply.render('pages/index');
};

exports.about = function (request, reply) {
  reply.render('pages/about');
};

exports.rules = function (request, reply) {
  reply.render('pages/rules');
};

exports.termofuse = function (request, reply) {
  reply.render('pages/termofuse');
};
