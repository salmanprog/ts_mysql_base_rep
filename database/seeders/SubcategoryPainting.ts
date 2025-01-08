import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:28,
        title: 'Oil Painting',
        slug: strSlug('oil_painting'),
        parent_id: 11,
        created_at: new Date(),
      },
      {
        id:29,
        title: 'Acrylic',
        slug: strSlug('acrylic'),
        parent_id: 11,
        created_at: new Date(),
      },
      {
        id:30,
        title: 'Ink Wash Painting',
        slug: strSlug('ink_wash_painting'),
        parent_id: 11,
        created_at: new Date(),
      }
    ]);
  }
}
