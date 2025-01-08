'use strict'

import Drive from '@ioc:Adonis/Core/Drive'
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'
import fs from 'fs'
//import {encode} from "blurhash";
//import { createCanvas, loadImage, Image } from 'canvas'
//import ffmpeg from 'fluent-ffmpeg';
import _ from 'lodash'
import {randomString} from 'App/Helpers/Index';

export default class FileUpload
{
    public static async doUpload(fileObject:object, destination_upload_path:string, resize:boolean=false)
    {
        let filename = destination_upload_path + '/' + `${new Date().getTime()}.${fileObject.subtype}`;
        let fileContent = fs.readFileSync(fileObject.tmpPath);
        await Drive.put(filename,fileContent)
        if( resize ){

        }
        return filename;
    }

    // public static async createBlurHash(image_path)
    // {
    //     let fileContent = await Drive.get(image_path);
    //     let image = await loadImage(fileContent)
    //     let imageData = this.getImageData(image)
    //     return encode(
    //       imageData.data,
    //       imageData.width,
    //       imageData.height,
    //       4,
    //       4
    //     )
    // }

    // private static getImageData(image: Image)
    // {
    //     let canvas = createCanvas(image.width, image.height)
    //     let context = canvas.getContext('2d')
    //     context.drawImage(image, 0, 0)
    //     return context.getImageData(0, 0, image.width, image.height)
    // }

}
