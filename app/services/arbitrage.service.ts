import db from '../infrastructure/index';
import { IArbitrage } from '../infrastructure/mongodb/models/arbitrage.model';

export default class ArbitrageService{
  public async createArbitrage(arbitrage: IArbitrage): Promise<IArbitrage> {
    return db.arbitrage.create(arbitrage);
  }

  public async getArbitrageById(id: string): Promise<IArbitrage | null> {
    return db.arbitrage.findById(id);
  }


  public async getAggregate(aggregate: any): Promise<any> {
    return db.arbitrage.findByAggregate(aggregate);
  }

  public async getAllArbitrages(): Promise<IArbitrage[]> {
    return db.arbitrage.findAll();
  }

  public async getActiveArbitrages(filter:any): Promise<IArbitrage[]> {
    // return db.arbitrage.findAll({sports,gameType});
    return db.arbitrage.findSelection(filter);
  }

  public async updateArbitrage(filter:any, arbitrage: Partial<IArbitrage> | any): Promise<IArbitrage | null> {
    return db.arbitrage.update(filter, arbitrage);
  }

  public async updateManyArbitrage(filter:any, arbitrage: Partial<IArbitrage> | any): Promise<number | null> {
    const updatedIds = await db.arbitrage.updateMany(filter, arbitrage);
    return updatedIds;
  }

  public async deleteArbitrage(id: string): Promise<IArbitrage | null> {
    return db.arbitrage.delete(id);
  }
}
