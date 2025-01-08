import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('property_categories').insert([
      {
        id:45,
        title: 'Gas',
        slug: strSlug('gas'),
        parent_id: 8,
        created_at: new Date(),
      },
      {
        id:46,
        title: 'Electric',
        slug: strSlug('electric'),
        parent_id: 8,
        created_at: new Date(),
      },
      {
        id:47,
        title: 'None',
        slug: strSlug('none'),
        parent_id: 8,
        created_at: new Date(),
      }
    ]);
  }
}
