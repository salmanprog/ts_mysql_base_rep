import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('slug', 150).notNullable().unique();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('subscription_id').unsigned().references('id').inTable('subscriptions').onDelete('CASCADE').onUpdate('NO ACTION');
      table.text('transaction_id').notNullable();
      table.enu('gateway_type',['google-pay','apple-pay','strip']).notNullable().defaultTo('strip');
      table.string('subscription_title').notNullable();
      table.integer('subscription_amount',11).notNullable().defaultTo('0');
      table.string('subscription_start_date',255).notNullable();
      table.string('subscription_end_date',255).notNullable();
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
