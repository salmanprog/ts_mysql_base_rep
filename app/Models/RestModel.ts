import { BaseModel } from '@ioc:Adonis/Lucid/Orm'
import Config from '@ioc:Adonis/Core/Config'
import _ from 'lodash';

export default class RestModels extends BaseModel
{
    protected static __softDelete = true;

    public static async createRecord(request:any,params:any)
    {
        //before create hook
        if (_.isFunction(this.loadHook(request).beforeCreateHook)) {
            await this.loadHook(request).beforeCreateHook(request, params);
        }
        //insert record
        var record:any = await this.create(params);
        //after create hook
        if (_.isFunction(this.loadHook(request).afterCreateHook)) {
            await this.loadHook(request).afterCreateHook(record, request, params);
        }
        //get record by id
        record = await this.getRecordBySlug(request, record.slug);
        return record;
    }

    public static async getRecords(request:any, params:any = {})
    {
        let query:any = this.query()
                        .select()
                        .whereNull(this.table + ".deleted_at");
        //query hook
        if (_.isFunction(this.loadHook(request).indexQueryHook)) {
            await this.loadHook(request).indexQueryHook(query, request, params);
        }
        let record_limit = _.isEmpty(params.limit) ? Config.get("constants.PAGINATION_LIMIT") : parseInt(params.limit);
        query = await query.paginate(_.isEmpty(params.page) ? 1 : params.page, record_limit);
        return query.toJSON();
    }

    public static async getRecordBySlug(request:any, slug:string)
    {
        let record:any;
        let query:any = this.query()
                        .select()
                        .whereNull(this.table + ".deleted_at");
        //query hook
        if (_.isFunction(this.loadHook(request).indexQueryHook)) {
            await this.loadHook(request).indexQueryHook(query, request, slug);
        }
        //get record
        record = await query.where(this.table + ".slug", slug).first();
        if( !_.isEmpty(record) ){
            record = record.toJSON();
        } else{
            record = {};
        }
        return record;
    }

    public static async updateRecord(request:any, params:any, slug:string)
    {
        let record:any;
        //before update hook
        if (_.isFunction(this.loadHook(request).beforeEditHook)) {
            await this.loadHook(request).beforeEditHook(request, params, slug);
        }
        //update record
        if (!_.isEmpty(params) ) {
            record = await this.query().where(this.table +".slug", slug).update(params);
        }
        //After  update hook
        if (_.isFunction(this.loadHook(request).afterEditHook)) {
            await this.loadHook(request).afterEditHook(request, slug);
        }

        record = await this.getRecordBySlug(request, slug);
        return record;
    }

    public static async deleteRecord(request:any, params:any, slug:string)
    {
        let slug_arr = [];
        if( slug == 'delete-record' ){
          slug_arr = params.slug
        } else {
          slug_arr.push(slug);
        }
        //before delete hook
        if (_.isFunction(this.loadHook(request).beforeDeleteHook)) {
            await this.loadHook(request).beforeDeleteHook(request, params, slug_arr);
        }
        //check soft delete
        if ( this.__softDelete ) {
          await this.query()
                    .whereIn(this.table +".slug", slug_arr)
                    .update({ deleted_at: new Date()});
        } else {
            await this.query().whereIn(this.table +".slug", slug_arr).delete();
        }
        //after delete hook
        if (_.isFunction(this.loadHook(request).afterDeleteHook)) {
            await this.loadHook(request).afterDeleteHook(request, params, slug_arr);
        }
        return true;
    }

    public static async dataTableRecords(request:any)
    {
      let data   = [];
      let params = request.all();
      let query:any  = this.query()
                    .select()
                    .whereNull(this.table + ".deleted_at");

      if(_.isFunction(this.loadHook(request).datatable_query_hook))
          await this.loadHook(request).datatable_query_hook(query,request);

      let total_record = query;
      query = await query.limit(parseInt(params['length'])).offset(parseInt(params['start'])).orderBy(this.table + '.id','desc');
      data['records'] = !_.isEmpty(query) ? query : [];
      let count = await total_record.getCount();
      data['total_record'] = parseInt(count);
      return data;
    }

    private static loadHook(request:any)
    {
        let hookName = this.prototype.constructor.name + 'Hook';
        let url = request.url();
        if( url.includes('api') ){
          return require(`App/Models/Hooks/Api/${hookName}`).default;
        } else {
          return require(`App/Models/Hooks/Admin/${hookName}`).default;
        }
    }
}
