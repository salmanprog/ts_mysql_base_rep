import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'
;
export default class extends BaseSeeder {
  public async run () {
    await Database.table('subscriptions').insert([
      {
        id:1,
        title: 'Free',
        slug: strSlug('Free'),
        description: '3-day free trial',
        amount: '1',
        created_at: new Date(),
      },
      {
        id:2,
        title: '1 year for $150.00',
        slug: strSlug('1 year'),
        description: '3-day free trial',
        amount: '150',
        created_at: new Date(),
      },
      {
        id:3,
        title: '1 month for $20.00',
        slug: strSlug('1 month'),
        description: '3-day free trial',
        amount: '20',
        created_at: new Date(),
      }
    ]);
  }
}
