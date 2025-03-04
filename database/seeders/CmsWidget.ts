import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import { strSlug } from 'App/Helpers/Index'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('cms_widgets').insert([
      {
        id:1,
        slug: strSlug('total-users'),
        title: 'Total User',
        description: '',
        icon: 'icon-user',
        color: '#262525',
        div_column_class: 'col-md-4',
        link: '/admin/app-users',
        widget_type: 'small_box',
        sql: 'Select count(*) as total_user from users where user_group_id = 3 limit 1',
        config: '',
        created_at: new Date(),
      },
      {
        id:2,
        slug: strSlug('total-vendors'),
        title: 'Total Vendor',
        description: '',
        icon: 'icon-user',
        color: '#262525',
        div_column_class: 'col-md-4',
        link: '/admin/app-users',
        widget_type: 'small_box',
        sql: 'Select count(*) as total_user from users where user_group_id = 4 limit 1',
        config: '',
        created_at: new Date(),
      },
      {
        id:3,
        slug: strSlug('total-properties'),
        title: 'Total Properties',
        description: '',
        icon: 'icon-home',
        color: '#262525',
        div_column_class: 'col-md-4',
        link: '/admin/app-users',
        widget_type: 'small_box',
        sql: 'Select count(*) as total_user from properties limit 1',
        config: '',
        created_at: new Date(),
      },
      // {
      //   id:4,
      //   slug: strSlug('total-property-task'),
      //   title: 'Total Property Task',
      //   description: '',
      //   icon: 'icon-user',
      //   color: '#262525',
      //   div_column_class: 'col-md-3',
      //   link: '/admin/app-users',
      //   widget_type: 'small_box',
      //   sql: 'Select count(*) as total_user from property_tasks limit 1',
      //   config: '',
      //   created_at: new Date(),
      // },
      {
        id:5,
        slug: strSlug('users'),
        title: 'User',
        description: '',
        icon: 'icon-user',
        color: '#fff',
        div_column_class: 'col-md-12',
        link: '/admin/app-users',
        widget_type: 'line_chart',
        sql: 'SELECT count(id) AS value, MONTHNAME(created_at) as label FROM users where YEAR(created_at) = YEAR(now()) group by MONTH(created_at) order by MONTH(created_at) asc',
        config: '',
        created_at: new Date(),
      }
    ]);
  }
}
