import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cms_widgets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug',100).notNullable().unique()
      table.string('title',255).notNullable()
      table.text('description').notNullable()
      table.string('icon',255).notNullable()
      table.string('color',255).notNullable()
      table.string('div_column_class',255).notNullable()
      table.string('link',255).notNullable()
      table.string('widget_type',255).notNullable()
      table.text('sql').notNullable()
      table.text('config').nullable()
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
