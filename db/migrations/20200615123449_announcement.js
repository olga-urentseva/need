exports.up = function (knex) {
  return knex.schema.createTable('announcements', function (table) {
    table.increments('user_id');
    table.string('description');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('announcements');
};
