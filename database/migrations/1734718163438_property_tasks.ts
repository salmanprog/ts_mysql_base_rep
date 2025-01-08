import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'property_tasks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug',100).notNullable().unique()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('property_id').unsigned().references('id').inTable('properties').onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('title',100).notNullable()
      table.text('description').nullable()
      table.string('task_date',255).notNullable()
      table.string('task_time',255).notNullable()
      table.string('notification_send_by',255).notNullable()
      table.string('task_notification_date',255).notNullable()
      table.string('task_notification_time',255).notNullable()
      table.enu('is_notify',['1','0']).notNullable().defaultTo('0')
      table.enu('task_status',['pending','complete','missed']).notNullable().defaultTo('pending')
      table.enu('status',['1','0']).notNullable().defaultTo('1')
      table.timestamp('created_at', { useTz: true }).nullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at',{ useTz: true }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
