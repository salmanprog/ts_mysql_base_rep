import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('property_categories').insert([
      {
        id:37,
        title: 'Shrubs',
        slug: strSlug('shrubs'),
        parent_id: 6,
        created_at: new Date(),
      },
      {
        id:38,
        title: 'Vines',
        slug: strSlug('vines'),
        parent_id: 6,
        created_at: new Date(),
      },
      {
        id:39,
        title: 'Trees',
        slug: strSlug('trees'),
        parent_id: 6,
        created_at: new Date(),
      },
      {
        id:40,
        title: 'Orchard',
        slug: strSlug('orchard'),
        parent_id: 6,
        created_at: new Date(),
      },
      {
        id:41,
        title: "Fish Pond",
        slug: strSlug('fishpond'),
        parent_id: 6,
        created_at: new Date(),
      }
    ]);
  }
}
