import db from '../infrastructure/index';
import bcrypt from 'bcryptjs';
import { ISubscription,ISubscriptionOptional } from '../infrastructure/mongodb/models/subscription.model';
import { IPlan,IPlanOptional } from '../infrastructure/mongodb/models/plan.model';
import { IResponse, IUserDTO } from '../types/global';


export default class SubscriptionService {

  public async createSubscription(subscription: ISubscriptionOptional): Promise<ISubscription> {
    return db.subscription.create(subscription);
  }

  public async getSubscriptionById(id: string): Promise<ISubscription | null> {
    return db.subscription.findById(id);
  }
  
  public async getSubscription(filter: ISubscriptionOptional): Promise<ISubscription[]> {
    return db.subscription.findSelection(filter);
  }

  public async getAllSubscription(): Promise<ISubscription[]> {
    return db.subscription.findAll();
  }

  public async getSubscriptionHistories(filter: ISubscriptionOptional): Promise<any> {
    const results = await this.getAggregate([
      {
        $match: filter,
      },
      { $limit: 20 }, // Limit the result to 20 documents
      {
        $lookup: {
          from: 'plans',  // Plans collection name
          localField: 'planId',
          foreignField: '_id',
          as: 'plan',
        },
      },
      {
        $unwind: {
          path: '$plan',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return results;
  }

  public async getAggregate(aggregate: any): Promise<ISubscription[]> {
    return db.subscription.findByAggregate(aggregate);
  }

  public async updateSubscription(filter:any, subscription: ISubscriptionOptional): Promise<ISubscription | null> {
    return db.subscription.update(filter, subscription);
  }

  public async deleteSubscription(id: string): Promise<ISubscription | null> {
    return db.subscription.delete(id);
  }


  public async getAllActivePlans(): Promise<IPlan[]> {
    return db.plan.findSelection({status:1});
  }

}