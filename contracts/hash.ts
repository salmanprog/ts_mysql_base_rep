/**
 * Contract source: https://git.io/Jfefs
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

import { InferListFromConfig } from '@adonisjs/core/build/config'
import hashConfig from '../config/hash'
import { PlainTextDriver } from '../providers/HashDriver'

declare module '@ioc:Adonis/Core/Hash' {
  interface HashersList extends InferListFromConfig<typeof hashConfig> {}
  interface HashDrivers {
    plainText: {
      config: {
        driver: 'plainText',
        // ...rest of the config
      }
      implementation: PlainTextDriver
    }
  }
}
