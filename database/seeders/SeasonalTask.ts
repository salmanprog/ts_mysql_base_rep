import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('seasonal_tasks').insert([
      {
        id:1,
        user_id: '1',
        category_id: '1',
        title: 'Organise household chemicals',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s',
        task_date: '2025-02-28',
        task_time: '11:30 AM',
        slug: strSlug('organise-household-chemicals'),
        created_at: new Date(),
      },
      {
        id:2,
        user_id: '1',
        category_id: '1',
        title: 'Deodorize drains',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s',
        task_date: '2025-03-25',
        task_time: '11:30 AM',
        slug: strSlug('deodorize-drains'),
        created_at: new Date(),
      },
      {
        id:3,
        user_id: '1',
        category_id: '1',
        title: 'Sanitize bathroom surfaces',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s',
        task_date: '2025-03-20',
        task_time: '11:30 AM',
        slug: strSlug('sanitize-bathroom-surfaces'),
        created_at: new Date(),
      },
      {
        id:4,
        user_id: '1',
        category_id: '2',
        title: 'Wash a shower curtain',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s',
        task_date: '2025-03-20',
        task_time: '11:30 AM',
        slug: strSlug('wash-a-shower-curtain'),
        created_at: new Date(),
      },
      {
        id:5,
        user_id: '1',
        category_id: '2',
        title: 'Launder bath rugs',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s',
        task_date: '2025-03-20',
        task_time: '11:30 AM',
        slug: strSlug('launder-bath-rugs'),
        created_at: new Date(),
      }
    ]);
  }
}
