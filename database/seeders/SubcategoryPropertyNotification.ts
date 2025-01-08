import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('property_categories').insert([
      {
        id:56,
        title: 'Yes',
        slug: strSlug('yes1'),
        parent_id: 11,
        created_at: new Date(),
      },
      {
        id:57,
        title: 'May be Later',
        slug: strSlug('maybelater'),
        parent_id: 11,
        created_at: new Date(),
      }
    ]);
  }
}
