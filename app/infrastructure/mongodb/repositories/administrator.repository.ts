import Administrator from '../models/administrator.model';
import { IAdministratorRepository } from '../../repositories/administrator.interface';

export class AdministratorRepository implements IAdministratorRepository {
  async fetchAdministrators(): Promise<any[]> {
    const found = await Administrator.find();
    return found;
  }
}
