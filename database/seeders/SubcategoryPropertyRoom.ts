import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('property_categories').insert([
      {
        id:25,
        title: '1-2',
        slug: strSlug('room1-2'),
        parent_id: 4,
        created_at: new Date(),
      },
      {
        id:26,
        title: '3-4',
        slug: strSlug('room3-4'),
        parent_id: 4,
        created_at: new Date(),
      },
      {
        id:27,
        title: '5-7',
        slug: strSlug('room5-7'),
        parent_id: 4,
        created_at: new Date(),
      },
      {
        id:28,
        title: '8 and more',
        slug: strSlug('room8'),
        parent_id: 4,
        created_at: new Date(),
      },
      {
        id:29,
        title: "I don't want to answer",
        slug: strSlug('dontanswer'),
        parent_id: 4,
        created_at: new Date(),
      }
    ]);
  }
}
