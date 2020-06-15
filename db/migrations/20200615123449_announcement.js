exports.up = function (knex) {
  return knex.schema.createTable('announcements', function (table) {
    table.increments('user_id');
    table.string('description');
    table.date('date');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('announcements');
};
