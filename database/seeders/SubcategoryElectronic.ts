import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:31,
        title: 'Power Electronics',
        slug: strSlug('power_electronics'),
        parent_id: 8,
        created_at: new Date(),
      },
      {
        id:32,
        title: 'Micro Electronics',
        slug: strSlug('microelectronics'),
        parent_id: 8,
        created_at: new Date(),
      }
    ]);
  }
}
