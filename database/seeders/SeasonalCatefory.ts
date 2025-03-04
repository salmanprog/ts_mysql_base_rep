import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('seasonal_categories').insert([
      {
        id:1,
        user_id: '1',
        title: 'Summers',
        slug: strSlug('summers'),
        created_at: new Date(),
      },
      {
        id:2,
        user_id: '1',
        title: 'Fall',
        slug: strSlug('fall'),
        created_at: new Date(),
      }
    ]);
  }
}
