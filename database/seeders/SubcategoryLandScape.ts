import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:51,
        title: 'Trees',
        slug: strSlug('trees_land'),
        parent_id: 17,
        created_at: new Date(),
      },
      {
        id:52,
        title: 'Sod',
        slug: strSlug('sod_land'),
        parent_id: 17,
        created_at: new Date(),
      },
      {
        id:53,
        title: 'Retention Walls',
        slug: strSlug('retention_walls'),
        parent_id: 17,
        created_at: new Date(),
      },
      {
        id:54,
        title: 'Flowers',
        slug: strSlug('flowers_land'),
        parent_id: 17,
        created_at: new Date(),
      }
    ]);
  }
}
