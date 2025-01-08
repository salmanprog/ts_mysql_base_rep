import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_group_id').unsigned().references('id').inTable('user_groups').onDelete('CASCADE').onUpdate('NO ACTION');
      table.enu('user_type',['admin','user','vendor']).notNullable().defaultTo('user')
      table.string('name',150).notNullable()
      table.string('username',150).notNullable().unique()
      table.string('slug',150).notNullable().unique()
      table.string('email',150).nullable().unique()
      table.string('mobile_no',100).nullable().unique()
      table.enu('gender',['male','female']).notNullable().defaultTo('male')
      table.string('dob',200).nullable()
      table.string('password',255).notNullable()
      table.text('image_url').nullable()
      table.string('blur_image',200).nullable()
      table.enu('status',['1','0']).notNullable().defaultTo('1')
      table.enu('is_email_verify',['1','0']).notNullable().defaultTo('0')
      table.timestamp('email_verify_at').nullable()
      table.enu('is_mobile_verify',['1','0']).nullable().defaultTo('1')
      table.timestamp('mobile_verify_at').nullable()
      table.string('platform_type').notNullable().defaultTo('custom')
      table.string('platform_id').nullable()
      table.string('country',100).nullable()
      table.string('city',100).nullable()
      table.string('state',100).nullable()
      table.string('zipcode',100).nullable()
      table.string('address',100).nullable()
      table.string('latitude',100).nullable()
      table.string('longitude',100).nullable()
      table.enu('online_status',['1','0']).notNullable().defaultTo('0')
      table.string('mobile_otp',100).nullable()
      table.timestamp('mobile_otp_created_at', { useTz: true }).nullable()
      table.string('email_otp',100).nullable()
      table.timestamp('email_otp_created_at', { useTz: true }).nullable()
      table.enu('is_subscription',['1','0']).nullable().defaultTo('0')
      table.integer('subscripton_id').unsigned().references('id').inTable('subscriptions').onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('subscription_start_date',255).nullable()
      table.string('subscription_end_date',255).nullable()
      table.integer('total_property_task',11).notNullable().defaultTo('0')
      table.integer('total_property_task_complete',11).notNullable().defaultTo('0')
      table.integer('total_property_task_pending',11).notNullable().defaultTo('0')
      table.timestamp('created_at', { useTz: true }).nullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at',{ useTz: true }).nullable()
      table.index('name')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
