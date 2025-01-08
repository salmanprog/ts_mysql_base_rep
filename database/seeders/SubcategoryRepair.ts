import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('vendor_categories').insert([
      {
        id:33,
        title: 'Automotive Service Technicians and Mechanics',
        slug: strSlug('automotive_service_technicians_and_mechanics'),
        parent_id: 12,
        created_at: new Date(),
      },
      {
        id:34,
        title: 'Air Conditioning Technician',
        slug: strSlug('air_conditioning_technician'),
        parent_id: 12,
        created_at: new Date(),
      },
      {
        id:35,
        title: 'Corrective Maintenance',
        slug: strSlug('corrective_maintenance'),
        parent_id: 12,
        created_at: new Date(),
      },
      {
        id:36,
        title: 'Preventive Maintenance',
        slug: strSlug('preventive_maintenance'),
        parent_id: 12,
        created_at: new Date(),
      },
      {
        id:37,
        title: 'Heavy Equipment Mechanics',
        slug: strSlug('heavy_equipment_mechanics'),
        parent_id: 12,
        created_at: new Date(),
      }
    ]);
  }
}
