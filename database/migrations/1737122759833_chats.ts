import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'chats'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('slug', 150).notNullable().unique();
      table.integer('reciever_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('sender_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('group_id').notNullable().defaultTo('0');
      table.text('message').nullable();
      table.string('file',255).nullable();
      table.enum('seen', ['0', '1']).notNullable().defaultTo('0');
      table.enum('delivered', ['0', '1']).notNullable().defaultTo('0');
      table.enum('type', ['text', 'image', 'video', 'file']).notNullable().defaultTo('text');
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).nullable();
      table.timestamp('updated_at', { useTz: true }).nullable();
      table.timestamp('deleted_at', { useTz: true }).nullable();
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
