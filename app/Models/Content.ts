import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import RestModel from './RestModel'

export default class Content extends RestModel {

  public static table = 'content_managements'

    @column({ isPrimary: true })
    public id: number

    @column()
    public title: string

    @column()
    public slug: string

    @column()
    public content: string

    @column()
    public status: number

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    public static fillable()
    {
        return ['title','slug','content','status','created_at','updated_at','deleted_at']
    }
}
