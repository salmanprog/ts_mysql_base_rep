import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('property_categories').insert([
      {
        id:50,
        title: 'Cat',
        slug: strSlug('cat'),
        parent_id: 10,
        created_at: new Date(),
      },
      {
        id:51,
        title: 'Dog',
        slug: strSlug('dog'),
        parent_id: 10,
        created_at: new Date(),
      },
      {
        id:52,
        title: 'Fish',
        slug: strSlug('fish'),
        parent_id: 10,
        created_at: new Date(),
      },
      {
        id:53,
        title: 'Birds',
        slug: strSlug('birds'),
        parent_id: 10,
        created_at: new Date(),
      },
      {
        id:54,
        title: 'Reptiles',
        slug: strSlug('reptiles'),
        parent_id: 10,
        created_at: new Date(),
      },
      {
        id:55,
        title: 'Rodents',
        slug: strSlug('rodents'),
        parent_id: 10,
        created_at: new Date(),
      }
    ]);
  }
}
