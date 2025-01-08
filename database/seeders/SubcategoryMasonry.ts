import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:41,
        title: 'Laying Bricks and Blocks',
        slug: strSlug('laying_bricks_and_blocks'),
        parent_id: 14,
        created_at: new Date(),
      },
      {
        id:42,
        title: 'Chimney Building and Repairs',
        slug: strSlug('chimney_building_and_repairs'),
        parent_id: 14,
        created_at: new Date(),
      }
    ]);
  }
}
