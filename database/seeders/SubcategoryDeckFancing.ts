import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:47,
        title: 'Wood',
        slug: strSlug('wood_deck'),
        parent_id: 16,
        created_at: new Date(),
      },
      {
        id:48,
        title: 'Vinyl',
        slug: strSlug('vinyl_deck'),
        parent_id: 16,
        created_at: new Date(),
      },
      {
        id:49,
        title: 'Metal',
        slug: strSlug('metal_deck'),
        parent_id: 16,
        created_at: new Date(),
      },
      {
        id:50,
        title: 'Composite',
        slug: strSlug('composite_deck'),
        parent_id: 16,
        created_at: new Date(),
      }
    ]);
  }
}
