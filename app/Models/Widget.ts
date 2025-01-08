import { column } from '@ioc:Adonis/Lucid/Orm'
import _ from 'lodash'
import { DateTime } from 'luxon'
import RestModel from './RestModel'

export default class Widget extends RestModel
{
    public static table = 'cms_widgets'

    @column({ isPrimary: true })
    public id: number

    @column()
    public title: string

    @column()
    public description: string

    @column()
    public icon: string

    @column()
    public color:string

    @column()
    public div_column_class:string

    @column()
    public link:string


    @column()
    public widget_type:string

    @column()
    public sql:string

    @column()
    public config:string

    @column()
    public status:number

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @column()
    public deleted_at: DateTime | null


    public static fillable()
    {
        return [
          'title','description','icon','color','div_column_class','link','widget_type','sql','config','status','created_at','updated_at'
        ]
    }

    public static async getWidgetByType(widget_type)
    {
      let result = await this.query().where('widget_type', widget_type).where('status', '1');
      return  result;
    }

}
