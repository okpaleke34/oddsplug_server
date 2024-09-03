import Subscription, { ISubscription, ISubscriptionOptional } from '../models/subscription.model';
import { FilterQuery } from 'mongoose';
import { ISubscriptionRepository } from '../../repositories/subscription.interface';

export class SubscriptionRepository implements ISubscriptionRepository {
  
  public async create(subscription: ISubscription): Promise<ISubscription> {
    const newSubscription = await Subscription.create(subscription);
    return newSubscription
  }

  public async findById(id: string): Promise<ISubscription | null> {
    return Subscription.findById(id).exec();
  }

  public async findAll(): Promise<ISubscription[]> {
    return Subscription.find().exec();
  }

  public async findByAggregate(aggregate: any): Promise<ISubscription[]> {
    return Subscription.aggregate(aggregate).exec();
  }

  public async findSelection(filter:ISubscriptionOptional): Promise<ISubscription[]> {
    const filterQuery: FilterQuery<ISubscription> = filter as FilterQuery<ISubscription>;
    return Subscription.find(filterQuery).exec();
  }

  public async update(filter:ISubscriptionOptional, subscription: ISubscriptionOptional): Promise<ISubscription | null> {   
    const filterQuery: FilterQuery<ISubscription> = filter as FilterQuery<ISubscription>; 
    const updated = await Subscription.findOneAndUpdate(filterQuery, subscription, { new: true }).exec();
    return updated;
  }


  public async updateMany(filter:ISubscriptionOptional, subscription: ISubscriptionOptional): Promise<number | null> {
    const filterQuery: FilterQuery<ISubscription> = filter as FilterQuery<ISubscription>; 
    const updated = await Subscription.updateMany(filterQuery, subscription, { upsert: true }).exec();
    return updated.modifiedCount;
  }

  public async delete(id: string): Promise<ISubscription | null> {
    return Subscription.findByIdAndDelete(id).exec();
  }
}

