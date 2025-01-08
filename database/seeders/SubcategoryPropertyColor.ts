import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('property_categories').insert([
      {
        id:16,
        title: 'Red',
        slug: strSlug('red'),
        parent_id: 2,
        created_at: new Date(),
      },
      {
        id:17,
        title: 'Blue',
        slug: strSlug('blue'),
        parent_id: 2,
        created_at: new Date(),
      },
      {
        id:18,
        title: 'Green',
        slug: strSlug('green'),
        parent_id: 2,
        created_at: new Date(),
      },
      {
        id:19,
        title: 'Yellow',
        slug: strSlug('yellow'),
        parent_id: 2,
        created_at: new Date(),
      }
    ]);
  }
}
