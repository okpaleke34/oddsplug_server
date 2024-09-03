import db from '../infrastructure/index';
import { ISupport,ISupportOptional } from '../infrastructure/mongodb/models/support.model';


export default class SupportService {

  public async createSupport(support: ISupportOptional): Promise<ISupport> {
    return db.support.create(support);
  }

  public async getSupportById(id: string): Promise<ISupport | null> {
    return db.support.findById(id);
  }


  public async getSupport(filter: ISupportOptional): Promise<ISupport[]> {
    return db.support.findSelection(filter);
  }

  public async getAllSupport(): Promise<ISupport[]> {
    return db.support.findAll();
  }

  public async updateSupport(filter:any, support: ISupportOptional): Promise<ISupport | null> {
    return db.support.update(filter, support);
  }

  public async deleteSupport(id: string): Promise<ISupport | null> {
    return db.support.delete(id);
  }
}