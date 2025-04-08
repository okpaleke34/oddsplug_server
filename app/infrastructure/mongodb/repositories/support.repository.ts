import Support, { ISupport, ISupportOptional } from '../models/support.model';
import { FilterQuery } from 'mongoose';
import { ISupportRepository } from '../../repositories/support.interface';


export class SupportRepository implements ISupportRepository {
  
  public async create(support: ISupport): Promise<ISupport> {
    const newSupport = await Support.create(support);
    return newSupport
  }

  public async findById(id: string): Promise<ISupport | null> {
    return Support.findById(id).exec();
  }

  public async findAll(): Promise<ISupport[]> {
    return Support.find().exec();
  }

  public async findByAggregate(aggregate: any): Promise<ISupport[]> {
    return Support.aggregate(aggregate).exec();
  }

  public async findSelection(filter:ISupportOptional): Promise<ISupport[]> {
    const filterQuery: FilterQuery<ISupport> = filter as FilterQuery<ISupport>;
    return Support.find(filterQuery).exec();
  }

  public async update(filter:ISupportOptional, support: ISupportOptional): Promise<ISupport | null> {   
    const filterQuery: FilterQuery<ISupport> = filter as FilterQuery<ISupport>; 
    const updated = await Support.findOneAndUpdate(filterQuery, support, { new: true }).exec();
    return updated;
  }


  public async updateMany(filter:ISupportOptional, support: ISupportOptional): Promise<number | null> {
    const filterQuery: FilterQuery<ISupport> = filter as FilterQuery<ISupport>; 
    const updated = await Support.updateMany(filterQuery, support).exec();
    return updated.modifiedCount;
  }

  public async delete(id: string): Promise<ISupport | null> {
    return Support.findByIdAndDelete(id).exec();
  }
}

