import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:22,
        title: 'Trim Carpenter',
        slug: strSlug('trim_carpenter'),
        parent_id: 8,
        created_at: new Date(),
      },
      {
        id:23,
        title: 'Cabinet Maker',
        slug: strSlug('cabinet_maker'),
        parent_id: 8,
        created_at: new Date(),
      },
      {
        id:24,
        title: 'Framer',
        slug: strSlug('framer'),
        parent_id: 8,
        created_at: new Date(),
      },
      {
        id:25,
        title: 'Rough Carpenter',
        slug: strSlug('rough_carpenter'),
        parent_id: 8,
        created_at: new Date(),
      }
    ]);
  }
}
