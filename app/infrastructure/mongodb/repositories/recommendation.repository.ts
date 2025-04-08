import Recommendation, { IRecommendation, IRecommendationOptional } from '../models/recommendation.model';
import { FilterQuery } from 'mongoose';
import { IRecommendationRepository } from '../../repositories/recommendation.interface';


export class RecommendationRepository implements IRecommendationRepository {
  
  public async create(recommendation: IRecommendation): Promise<IRecommendation> {
    const newRecommendation = await Recommendation.create(recommendation);
    return newRecommendation
  }

  public async findById(id: string): Promise<IRecommendation | null> {
    return Recommendation.findById(id).exec();
  }

  public async findAll(): Promise<IRecommendation[]> {
    return Recommendation.find().exec();
  }

  public async findByAggregate(aggregate: any): Promise<IRecommendation[]> {
    return Recommendation.aggregate(aggregate).exec();
  }

  public async findSelection(filter:IRecommendationOptional): Promise<IRecommendation[]> {
    const filterQuery: FilterQuery<IRecommendation> = filter as FilterQuery<IRecommendation>;
    return Recommendation.find(filterQuery).exec();
  }

  public async update(filter:IRecommendationOptional, recommendation: IRecommendationOptional): Promise<IRecommendation | null> {   
    const filterQuery: FilterQuery<IRecommendation> = filter as FilterQuery<IRecommendation>; 
    const updated = await Recommendation.findOneAndUpdate(filterQuery, recommendation, { new: true }).exec();
    return updated;
  }


  public async updateMany(filter:IRecommendationOptional, recommendation: IRecommendationOptional): Promise<number | null> {
    const filterQuery: FilterQuery<IRecommendation> = filter as FilterQuery<IRecommendation>; 
    const updated = await Recommendation.updateMany(filterQuery, recommendation).exec();
    return updated.modifiedCount;
  }

  public async delete(id: string): Promise<IRecommendation | null> {
    return Recommendation.findByIdAndDelete(id).exec();
  }
}

