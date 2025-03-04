import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:55,
        title: 'Vinyl',
        slug: strSlug('vinyl_flooring'),
        parent_id: 18,
        created_at: new Date(),
      },
      {
        id:56,
        title: 'Wood',
        slug: strSlug('wood_flooring'),
        parent_id: 18,
        created_at: new Date(),
      },
      {
        id:57,
        title: 'Lino',
        slug: strSlug('lino_flooring'),
        parent_id: 18,
        created_at: new Date(),
      },
      {
        id:58,
        title: 'Laminate',
        slug: strSlug('laminate_flooring'),
        parent_id: 18,
        created_at: new Date(),
      },
      {
        id:59,
        title: 'Custom Order',
        slug: strSlug('custom_order_flooring'),
        parent_id: 18,
        created_at: new Date(),
      }
    ]);
  }
}
