import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:48,
        title: 'Saturday',
        slug: strSlug('saturday'),
        parent_id: 3,
        created_at: new Date(),
      },
      {
        id:49,
        title: 'Sunday',
        slug: strSlug('sunday'),
        parent_id: 3,
        created_at: new Date(),
      },
      {
        id:50,
        title: 'Monday',
        slug: strSlug('monday'),
        parent_id: 3,
        created_at: new Date(),
      },
      {
        id:51,
        title: 'Tuesday',
        slug: strSlug('tuesday'),
        parent_id: 3,
        created_at: new Date(),
      },
      {
        id:57,
        title: 'Wednesday',
        slug: strSlug('wednesday'),
        parent_id: 3,
        created_at: new Date(),
      },
      {
        id:58,
        title: 'Thrusday',
        slug: strSlug('thrusday'),
        parent_id: 3,
        created_at: new Date(),
      },
      {
        id:59,
        title: 'Friday',
        slug: strSlug('friday'),
        parent_id: 3,
        created_at: new Date(),
      }
    ]);
  }
}
