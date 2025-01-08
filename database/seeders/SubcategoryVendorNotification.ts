import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:55,
        title: 'Yes',
        slug: strSlug('yes1'),
        parent_id: 5,
        created_at: new Date(),
      },
      {
        id:56,
        title: 'No',
        slug: strSlug('no1'),
        parent_id: 5,
        created_at: new Date(),
      }
    ]);
  }
}
