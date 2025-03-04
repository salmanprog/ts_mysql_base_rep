import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:24,
        title: 'Pipe',
        slug: strSlug('pipe'),
        parent_id: 6,
        created_at: new Date(),
      },
      {
        id:25,
        title: 'Water',
        slug: strSlug('water'),
        parent_id: 6,
        created_at: new Date(),
      },{
        id:26,
        title: 'Sanitary',
        slug: strSlug('sanitary'),
        parent_id: 6,
        created_at: new Date(),
      },{
        id:27,
        title: 'Drainage',
        slug: strSlug('drainage'),
        parent_id: 6,
        created_at: new Date(),
      }
    ]);
  }
}
