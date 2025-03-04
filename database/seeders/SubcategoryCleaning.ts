import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:36,
        title: 'Carpet Cleaning',
        slug: strSlug('carpet_cleaning'),
        parent_id: 10,
        created_at: new Date(),
      },
      {
        id:37,
        title: 'Window Cleaning',
        slug: strSlug('window_cleaning'),
        parent_id: 10,
        created_at: new Date(),
      },
      {
        id:38,
        title: 'Kitchen Cleaning',
        slug: strSlug('kitchen_cleaning'),
        parent_id: 10,
        created_at: new Date(),
      }
    ]);
  }
}
