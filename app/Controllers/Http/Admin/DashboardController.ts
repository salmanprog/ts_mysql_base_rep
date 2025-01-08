'use strict'

import Widget from 'App/Models/Widget';
import Controller from '../Controller';
import Database from '@ioc:Adonis/Lucid/Database';

export default class DashboardController extends Controller
{
    async index({view})
    {
        return await this.loadAdminView(view,'dashboard.index',{});
    }

    async getSmallWidget({ response })
    {
        let data:any = [];
        let widgets = await Widget.getWidgetByType('small_box');

        for (const widget of widgets) {

            const records = await Database.rawQuery(widget.sql);
            let value = 0;
            
            if (records.length) {
              let result = Object.values(JSON.parse(JSON.stringify(records[0])))
              // for (const record of records[0]) {
              //   value = record.count;
              // }
              value = result[0].total_user;
            }

            data.push({
                title: widget.title,
                icon: widget.icon,
                color: widget.color,
                div_column_class: widget.div_column_class,
                link: widget.link,
                config: widget.config,
                value: value,
            });

        }

        return response.json(data);

    }

    async getLineChart({ response })
    {
        let finalData:any = [];
        let widgets = await Widget.getWidgetByType('line_chart');

        for (const widget of widgets) {
            const records = await Database.rawQuery(widget.sql);
            let data:any = {};

            if (records.length) {
              data = {
                label: [],
                value: []
              };

              for (const record of records[0]) {
                data.label.push(record.label);
                data.value.push(record.value);
              }

              finalData.push({
                title: widget.title,
                description: widget.description,
                icon: widget.icon,
                color: widget.color,
                div_column_class: widget.div_column_class,
                link: widget.link,
                config: widget.config,
                data: data
              });
            } else {
              data = {};
            }
          }

        return response.json(finalData);
    }

}
