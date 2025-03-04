import { column,hasOne,HasOne,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import { strSlug, rand, currentDateTime } from 'App/Helpers/Index'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ProfileVisit extends RestModel
{
    public static table = 'profile_visits'

    @column({ isPrimary: true })
    public id: number

    @column()
    public actor_id: number

    @column()
    public target_id: number

    @column()
    public month: string

    @column()
    public year: string

    @column()
    public slug: string

    @column()
    public visit_date: string

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    @hasOne(() => User, {
        foreignKey: 'id',
        localKey: 'actor_id'
      })
      public Actor: HasOne<typeof User>

    @hasMany(() => User, {
      foreignKey: 'id',
        localKey: 'target_id'
    })
    public Target: HasMany<typeof User>

    public static fillable()
    {
        return [
          'actor_id','target_id','month','year','slug','visit_date','created_at','updated_at','deleted_at'
        ]
    }

    public static async generateSlug(name:string)
    {
        let slug = strSlug(name);
        let query = await this.query().where('slug',slug).count('id as total');
        return query[0].$extras.total == 0 ? slug : slug + query[0].$extras.total + rand(111,999);
    }


public static async getVisitor(target_id: number) {
  const currentYear = new Date().getFullYear();

  const months = [
    currentYear+'-01', currentYear+'-02', currentYear+'-03', currentYear+'-04', currentYear+'-05', currentYear+'-06', currentYear+'-07', currentYear+'-08', currentYear+'-09', currentYear+'-10', currentYear+'-11', currentYear+'-12'
  ];

  // Using raw query for formatted months
  const query = await Database.rawQuery(
    `SELECT
    months.month,
    COALESCE(COUNT(DISTINCT pv.actor_id), 0) AS user_count
FROM
    (SELECT '${months[0]}' AS month
     UNION ALL SELECT '${months[1]}'
     UNION ALL SELECT '${months[2]}'
     UNION ALL SELECT '${months[3]}'
     UNION ALL SELECT '${months[4]}'
     UNION ALL SELECT '${months[5]}'
     UNION ALL SELECT '${months[6]}'
     UNION ALL SELECT '${months[7]}'
     UNION ALL SELECT '${months[8]}'
     UNION ALL SELECT '${months[9]}'
     UNION ALL SELECT '${months[10]}'
     UNION ALL SELECT '${months[11]}') AS months
LEFT JOIN
    (SELECT actor_id, DATE_FORMAT(visit_date, '%Y-%m') AS visit_month
     FROM profile_visits
     WHERE YEAR(visit_date) = YEAR(CURDATE()) AND target_id = ${target_id}) pv
    ON months.month = pv.visit_month
GROUP BY
    months.month
ORDER BY
    months.month`);
  const results = query[0]; 
  return results;
}

}
