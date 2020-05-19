exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('user_id');
    table.string('email');
    table.string('name');
    table.string('last_name');
    table.string('password');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
