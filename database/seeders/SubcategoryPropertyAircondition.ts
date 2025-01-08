import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('property_categories').insert([
      {
        id:42,
        title: 'HVAC',
        slug: strSlug('hvac'),
        parent_id: 7,
        created_at: new Date(),
      },
      {
        id:43,
        title: 'Individual AC Unit',
        slug: strSlug('individualunit'),
        parent_id: 7,
        created_at: new Date(),
      },
      {
        id:44,
        title: 'Both',
        slug: strSlug('both'),
        parent_id: 7,
        created_at: new Date(),
      }
    ]);
  }
}
