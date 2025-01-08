import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import RestModel from './RestModel'

export default class Faq extends RestModel {

    @column({ isPrimary: true })
    public id: number

    @column()
    public question: string

    @column()
    public answer: string

    @column()
    public slug: string

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null

    public static fillable()
    {
        return ['slug','question','answer','created_at','updated_at','deleted_at']
    }
}
