exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id');
    table.string('email').notNullable();
    table.string('name').notNullable();
    table.string('last_name').notNullable();
    table.string('password').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
