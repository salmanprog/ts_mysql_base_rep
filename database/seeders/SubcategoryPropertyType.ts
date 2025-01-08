import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('property_categories').insert([
      {
        id:12,
        title: 'Home',
        slug: strSlug('home'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:13,
        title: 'Appartment',
        slug: strSlug('appartment'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:14,
        title: 'Office',
        slug: strSlug('office'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:15,
        title: 'Other',
        slug: strSlug('other'),
        parent_id: 1,
        created_at: new Date(),
      }
    ]);
  }
}
