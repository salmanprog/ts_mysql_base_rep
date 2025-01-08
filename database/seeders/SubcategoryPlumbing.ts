import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:15,
        title: 'Pipefitters and Steamfitters',
        slug: strSlug('pipefitters_and_steamfitters'),
        parent_id: 6,
        created_at: new Date(),
      },
      {
        id:16,
        title: 'Water Supply Plumbers',
        slug: strSlug('water_supply_plumbers'),
        parent_id: 6,
        created_at: new Date(),
      },{
        id:17,
        title: 'Sanitary Engineering',
        slug: strSlug('sanitary_engineering'),
        parent_id: 6,
        created_at: new Date(),
      },{
        id:18,
        title: 'Drainage',
        slug: strSlug('drainage'),
        parent_id: 6,
        created_at: new Date(),
      }
    ]);
  }
}
