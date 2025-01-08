import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:1,
        title: 'Services Types',
        slug: strSlug('services_types'),
        created_at: new Date(),
      },
      {
        id:2,
        title: 'Available Hours',
        slug: strSlug('available_hours'),
        created_at: new Date(),
      },
      {
        id:3,
        title: 'Available Day',
        slug: strSlug('available_day'),
        created_at: new Date(),
      },
      {
        id:4,
        title: 'Emergency Hour',
        slug: strSlug('emergency_hour'),
        created_at: new Date(),
      },
      {
        id:5,
        title: 'Notification',
        slug: strSlug('is_notification'),
        created_at: new Date(),
      }
    ]);
  }
}
