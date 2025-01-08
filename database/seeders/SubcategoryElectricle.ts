import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:19,
        title: 'Wireman',
        slug: strSlug('wireman'),
        parent_id: 7,
        created_at: new Date(),
      },
      {
        id:20,
        title: 'Solar Technician',
        slug: strSlug('solar_technician'),
        parent_id: 7,
        created_at: new Date(),
      },{
        id:21,
        title: 'Maintenance Electrician',
        slug: strSlug('maintenance_electrician'),
        parent_id: 7,
        created_at: new Date(),
      }
    ]);
  }
}
