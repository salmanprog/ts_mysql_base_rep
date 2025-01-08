import Controller from "../Controller";
import _ from 'lodash';

export default class GeneralController extends Controller
{
    protected __resource: string;
    protected __request: object;
    protected __response: object;
    protected __params: object;

    constructor() {
        super();
        this.__request; //adonis request obj
        this.__response; //adonis response obj
        this.__params = {}; // this is used for get parameters from url
    }

}
