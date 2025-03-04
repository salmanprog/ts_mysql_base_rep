import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:65,
        title: 'Morning (8:00 AM - 12:00 PM)',
        slug: strSlug('morning'),
        parent_id: 2,
        created_at: new Date(),
      },
      {
        id:66,
        title: 'Afternoon (12:00 PM - 4:00 PM)',
        slug: strSlug('afternoon'),
        parent_id: 2,
        created_at: new Date(),
      },
      {
        id:67,
        title: 'Evening (4:00 PM - 8:00 PM)',
        slug: strSlug('evening'),
        parent_id: 2,
        created_at: new Date(),
      },
      {
        id:68,
        title: 'FullDay (8:00 AM - 8:00 PM)',
        slug: strSlug('fullday'),
        parent_id: 2,
        created_at: new Date(),
      },
      {
        id:69,
        title: 'Flexible Hours (As needed)',
        slug: strSlug('flexible'),
        parent_id: 2,
        created_at: new Date(),
      }
    ]);
  }
}
