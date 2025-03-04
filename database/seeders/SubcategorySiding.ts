import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:40,
        title: 'Hardie Board',
        slug: strSlug('hardie_board'),
        parent_id: 12,
        created_at: new Date(),
      },
      {
        id:41,
        title: 'Metal',
        slug: strSlug('metal_siding'),
        parent_id: 12,
        created_at: new Date(),
      },
      {
        id:42,
        title: 'Vinyl',
        slug: strSlug('vinyl'),
        parent_id: 12,
        created_at: new Date(),
      },
      {
        id:43,
        title: 'Wood',
        slug: strSlug('wood'),
        parent_id: 12,
        created_at: new Date(),
      }
    ]);
  }
}
