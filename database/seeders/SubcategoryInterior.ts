import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:63,
        title: 'Residentials and/or Commericial',
        slug: strSlug('residentials_commericial_interior'),
        parent_id: 22,
        created_at: new Date(),
      }
    ]);
  }
}
