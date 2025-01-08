import { HashDriverContract } from '@ioc:Adonis/Core/Hash'
import passwordHash from 'password-hash';

export class PlainTextDriver implements HashDriverContract
{
  public async make(value: string) {
    return passwordHash.generate(value);
  }

  public async verify(hashedValue: string, plainValue: string) {
    return passwordHash.verify(plainValue,hashedValue);
  }
}
