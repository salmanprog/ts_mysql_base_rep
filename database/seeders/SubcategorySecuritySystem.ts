import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:61,
        title: 'Residentials and/or Commericial',
        slug: strSlug('residentials_commericial_security'),
        parent_id: 20,
        created_at: new Date(),
      }
    ]);
  }
}
