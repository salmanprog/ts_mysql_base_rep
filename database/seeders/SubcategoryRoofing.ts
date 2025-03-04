import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:39,
        title: 'Residential and/or Commercial',
        slug: strSlug('residential_commercial_roofing'),
        parent_id: 11,
        created_at: new Date(),
      },
    ]);
  }
}
