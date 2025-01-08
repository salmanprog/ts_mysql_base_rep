import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'activity_logging'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').defaultTo(0);
      table.string('ip_address').notNullable()
      table.string('user_agent').notNullable()
      table.string('http_method').notNullable()
      table.string('route_name').notNullable()
      table.string('url').notNullable()
      table.text('request_payload').nullable()
      table.text('request_header').nullable()
      table.string('http_status_code').nullable()
      table.text('response').nullable()
      table.string('content_type').nullable()
      table.timestamp('created_at', { useTz: true }).nullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
