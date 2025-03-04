import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'seasonal_tasks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('slug', 150).notNullable().unique();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('category_id').unsigned().references('id').inTable('seasonal_categories').onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('title',255).notNullable();
      table.text('description').nullable();
      table.text('image_url').nullable()
      table.string('task_date',255).notNullable()
      table.string('task_time',255).notNullable()
      table.timestamp('created_at', { useTz: true }).nullable();
      table.timestamp('updated_at', { useTz: true }).nullable();
      table.timestamp('deleted_at', { useTz: true }).nullable();
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
