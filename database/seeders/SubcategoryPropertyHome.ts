import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('property_categories').insert([
      {
        id:20,
        title: 'Condo/Appartment',
        slug: strSlug('condo-appartment'),
        parent_id: 3,
        created_at: new Date(),
      },
      {
        id:21,
        title: 'Detached House',
        slug: strSlug('detached-house'),
        parent_id: 3,
        created_at: new Date(),
      },
      {
        id:22,
        title: 'Town House',
        slug: strSlug('town-house'),
        parent_id: 3,
        created_at: new Date(),
      },
      {
        id:23,
        title: 'Farm House',
        slug: strSlug('farm-house'),
        parent_id: 3,
        created_at: new Date(),
      },
      {
        id:24,
        title: 'Other',
        slug: strSlug('other1'),
        parent_id: 3,
        created_at: new Date(),
      }
    ]);
  }
}
