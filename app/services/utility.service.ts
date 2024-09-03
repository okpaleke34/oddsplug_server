import { IUtility } from './../infrastructure/mongodb/models/utility.model';
import db from '../infrastructure/index';

export default class UtilityService{
  public async getUtilityByName(name: string): Promise<IUtility | null> {
    const utility = await db.utility.findByName(name);
    return utility;
  }

  public async getAllUtilities(): Promise<IUtility[]> {
    const utilities = await db.utility.findAll();
    return utilities
  }
}
