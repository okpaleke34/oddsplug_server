import Plan, { IPlan, IPlanOptional } from '../models/plan.model';
import { FilterQuery } from 'mongoose';
import { IPlanRepository } from '../../repositories/plan.interface';


export class PlanRepository implements IPlanRepository {
  
  public async create(plan: IPlan): Promise<IPlan> {
    const newPlan = await Plan.create(plan);
    return newPlan
  }

  public async findById(id: string): Promise<IPlan | null> {
    return Plan.findById(id).exec();
  }

  public async findAll(): Promise<IPlan[]> {
    return Plan.find().exec();
  }

  public async findByAggregate(aggregate: any): Promise<IPlan[]> {
    return Plan.aggregate(aggregate).exec();
  }

  public async findSelection(filter:IPlanOptional): Promise<IPlan[]> {
    const filterQuery: FilterQuery<IPlan> = filter as FilterQuery<IPlan>;
    return Plan.find(filterQuery).exec();
  }

  public async update(filter:IPlanOptional, plan: IPlanOptional): Promise<IPlan | null> {   
    const filterQuery: FilterQuery<IPlan> = filter as FilterQuery<IPlan>; 
    const updated = await Plan.findOneAndUpdate(filterQuery, plan, { new: true }).exec();
    return updated;
  }


  public async updateMany(filter:IPlanOptional, plan: IPlanOptional): Promise<number | null> {
    const filterQuery: FilterQuery<IPlan> = filter as FilterQuery<IPlan>; 
    const updated = await Plan.updateMany(filterQuery, plan).exec();
    return updated.modifiedCount;
  }

  public async delete(id: string): Promise<IPlan | null> {
    return Plan.findByIdAndDelete(id).exec();
  }
}

