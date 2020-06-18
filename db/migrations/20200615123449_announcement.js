exports.up = function (knex) {
  return knex.schema.createTable('announcements', function (table) {
    table.increments('id');
    table.string('description').notNullable();
    table.integer('user_id').unsigned().notNullable();

    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('announcements');
};
