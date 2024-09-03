import Admin from '../models/admin.model';
import { IAdminRepository } from '../../repositories/admin.interface';

export class AdminRepository implements IAdminRepository {
  async fetchAdmins(): Promise<any[]> {
    const found = await Admin.find();
    return found;
  }
}
