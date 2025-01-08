import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('property_categories').insert([
      {
        id:1,
        title: 'Property Types',
        slug: strSlug('property_types'),
        created_at: new Date(),
      },
      {
        id:2,
        title: 'Property Colors',
        slug: strSlug('property_colors'),
        created_at: new Date(),
      },
      {
        id:3,
        title: 'Property Home',
        slug: strSlug('property_home'),
        created_at: new Date(),
      },
      {
        id:4,
        title: 'Property Rooms',
        slug: strSlug('property_rooms'),
        created_at: new Date(),
      },
      {
        id:5,
        title: 'Property Extra Space',
        slug: strSlug('property_extra_space'),
        created_at: new Date(),
      },
      {
        id:6,
        title: 'Property Landscape',
        slug: strSlug('property_landscape'),
        created_at: new Date(),
      },
      {
        id:7,
        title: 'Property Air Conditions',
        slug: strSlug('property_air_conditions'),
        created_at: new Date(),
      },
      {
        id:8,
        title: 'Property Furnace',
        slug: strSlug('property_furnace'),
        created_at: new Date(),
      },
      {
        id:9,
        title: 'Property Solar Panel',
        slug: strSlug('property_solar_panel'),
        created_at: new Date(),
      },
      {
        id:10,
        title: 'Property HouseHold',
        slug: strSlug('property_household'),
        created_at: new Date(),
      },
      {
        id:11,
        title: 'Property Notification',
        slug: strSlug('property_notification'),
        created_at: new Date(),
      }
    ]);
  }
}
