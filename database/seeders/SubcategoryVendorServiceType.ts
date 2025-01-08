import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:6,
        title: 'Plumbing',
        slug: strSlug('plumbing'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:7,
        title: 'Electrical',
        slug: strSlug('electrical'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:8,
        title: 'Carpentry',
        slug: strSlug('carpentry'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:9,
        title: 'Electronics',
        slug: strSlug('electronics'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:10,
        title: 'Painting',
        slug: strSlug('painting'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:11,
        title: 'Labour',
        slug: strSlug('labour'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:12,
        title: 'Repairs',
        slug: strSlug('repairs'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:13,
        title: 'Cleaning',
        slug: strSlug('cleaning'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:14,
        title: 'Masonry',
        slug: strSlug('masonry'),
        parent_id: 1,
        created_at: new Date(),
      }
    ]);
  }
}
