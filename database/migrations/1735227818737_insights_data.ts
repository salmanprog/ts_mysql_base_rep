import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'insights_data'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug',100).notNullable().unique()
      table.integer('insight_id').unsigned().references('id').inTable('insights').onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('title',100).notNullable()
      table.text('image_url').nullable()
      table.text('description').nullable()
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
