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
        title: 'Electronics',
        slug: strSlug('electronics'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:9,
        title: 'Painting',
        slug: strSlug('painting'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:10,
        title: 'Cleaning',
        slug: strSlug('cleaning'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:11,
        title: 'Roofing',
        slug: strSlug('roofing'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:12,
        title: 'Siding',
        slug: strSlug('siding'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:13,
        title: 'Metals',
        slug: strSlug('metals'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:14,
        title: 'General Contractor',
        slug: strSlug('general_contractor'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:15,
        title: 'Foundation',
        slug: strSlug('foundation'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:16,
        title: 'Decks / Fencing',
        slug: strSlug('decks_fencing'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:17,
        title: 'Landscaping',
        slug: strSlug('landscaping'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:18,
        title: 'Flooring',
        slug: strSlug('flooring'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:19,
        title: 'Windows/Doors',
        slug: strSlug('windows_doors'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:20,
        title: 'Security Systems',
        slug: strSlug('security_systems'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:21,
        title: 'Exterior Lighting',
        slug: strSlug('exterior_lighting'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:22,
        title: 'Interior Design',
        slug: strSlug('interior_design'),
        parent_id: 1,
        created_at: new Date(),
      },
      {
        id:23,
        title: 'Home Inspections',
        slug: strSlug('home_inspections'),
        parent_id: 1,
        created_at: new Date(),
      }
    ]);
  }
}
