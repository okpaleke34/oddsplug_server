import { IUtilityRepository } from '../../repositories/utility.interface';
import Utility, { IUtility } from '../models/utility.model';


export class UtilityRepository implements IUtilityRepository {

  public async findByName(name: string): Promise<IUtility | null> {
    const utilities = await Utility.find({name}).exec();
    return utilities[0];
  }

  public async findAll(): Promise<IUtility[]> {
    const utilities = await Utility.find().exec();
    return utilities;
  }
}
