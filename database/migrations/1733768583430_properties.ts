import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'properties'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.text('name').notNullable()
      table.string('slug',150).notNullable().unique()
      table.text('image_url').nullable()
      table.string('country',100).nullable()
      table.string('city',100).nullable()
      table.string('state',100).nullable()
      table.string('zipcode',100).nullable()
      table.string('address',100).nullable()
      table.string('latitude',100).nullable()
      table.string('longitude',100).nullable()
      table.integer('property_types').unsigned().references('id').inTable('property_categories').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('property_colors').unsigned().references('id').inTable('property_categories').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('property_home').unsigned().references('id').inTable('property_categories').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('property_rooms').unsigned().references('id').inTable('property_categories').onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('property_extra_space',255).nullable();
      table.string('property_landscape',255).nullable();;
      table.integer('property_air_conditions').unsigned().references('id').inTable('property_categories').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('property_furnace').unsigned().references('id').inTable('property_categories').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('property_solar_panel').unsigned().references('id').inTable('property_categories').onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('property_household',255).nullable();
      table.integer('property_notification').unsigned().references('id').inTable('property_categories').onDelete('CASCADE').onUpdate('NO ACTION');
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
