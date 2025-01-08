import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:31,
        title: 'Construction Worker',
        slug: strSlug('construction_worker'),
        parent_id: 10,
        created_at: new Date(),
      },
      {
        id:32,
        title: 'Custodian',
        slug: strSlug('custodian'),
        parent_id: 10,
        created_at: new Date(),
      }
    ]);
  }
}
