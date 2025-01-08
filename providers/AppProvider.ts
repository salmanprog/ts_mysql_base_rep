import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import Application from '@ioc:Adonis/Core/Application'
import Admin from 'firebase-admin';
import _ from "lodash"

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready
    this.DBCountFn();
    this.lucidCountFn()
    this.hashPassword()
    this.firebaseInit()
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }

  private async hashPassword()
  {
    const { PlainTextDriver } = await import('./HashDriver')
    const Hash = this.app.container.use('Adonis/Core/Hash')

    Hash.extend('plainText', () => {
      return new PlainTextDriver()
    })
  }

  private async DBCountFn()
  {
      const {
        DatabaseQueryBuilder,
        raw
      } = this.app.container.use('Adonis/Lucid/Database')

      DatabaseQueryBuilder.macro('getCount', async function () {
        const result = await this.select(raw('COUNT(*) OVER() AS total'))
        return _.isEmpty(result) ? 0 : BigInt(result[0].$extras.total)
      })
  }

  private async lucidCountFn()
  {
      const {
        ModelQueryBuilder,
        raw
      } = this.app.container.use('Adonis/Lucid/Database')

      ModelQueryBuilder.macro('getCount', async function () {
        const result = await this.select(raw('COUNT(*) OVER() AS total'))
        return _.isEmpty(result) ? 0 : BigInt(result[0].$extras.total)
      })
  }

  private firebaseInit()
  {
    const serviceAccount = require(Application.appRoot + '/firebase-adminsdk.json');
    Admin.initializeApp({
      credential: Admin.credential.cert(serviceAccount)
    });
  }
}
