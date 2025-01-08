import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:53,
        title: 'Yes',
        slug: strSlug('yes'),
        parent_id: 4,
        created_at: new Date(),
      },
      {
        id:54,
        title: 'No',
        slug: strSlug('no'),
        parent_id: 4,
        created_at: new Date(),
      }
    ]);
  }
}
