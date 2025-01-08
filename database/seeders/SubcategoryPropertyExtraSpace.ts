import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('property_categories').insert([
      {
        id:30,
        title: 'Garage',
        slug: strSlug('garage'),
        parent_id: 5,
        created_at: new Date(),
      },
      {
        id:31,
        title: 'Car Porch',
        slug: strSlug('car-porch'),
        parent_id: 5,
        created_at: new Date(),
      },
      {
        id:32,
        title: 'Front Yard',
        slug: strSlug('front-yard'),
        parent_id: 5,
        created_at: new Date(),
      },
      {
        id:33,
        title: 'Back Yard',
        slug: strSlug('backyard'),
        parent_id: 5,
        created_at: new Date(),
      },
      {
        id:34,
        title: "Side Yard",
        slug: strSlug('sideyard'),
        parent_id: 5,
        created_at: new Date(),
      },
      {
        id:35,
        title: "Pool Area",
        slug: strSlug('poolarea'),
        parent_id: 5,
        created_at: new Date(),
      },
      {
        id:36,
        title: "Basement",
        slug: strSlug('basement'),
        parent_id: 5,
        created_at: new Date(),
      }
    ]);
  }
}
