import RecommendationComment, { IRecommendationComment, IRecommendationCommentOptional } from '../models/recommendation-comment.model';
import { FilterQuery } from 'mongoose';
import { IRecommendationCommentRepository } from '../../repositories/recommendation-comment.interface';


export class RecommendationCommentRepository implements IRecommendationCommentRepository {
  
  public async create(recommendationComment: IRecommendationComment): Promise<IRecommendationComment> {
    const newRecommendationComment = await RecommendationComment.create(recommendationComment);
    return newRecommendationComment
  }

  public async findById(id: string): Promise<IRecommendationComment | null> {
    return RecommendationComment.findById(id).exec();
  }

  public async findAll(): Promise<IRecommendationComment[]> {
    return RecommendationComment.find().exec();
  }

  public async findByAggregate(aggregate: any): Promise<IRecommendationComment[]> {
    return RecommendationComment.aggregate(aggregate).exec();
  }

  public async findSelection(filter:IRecommendationCommentOptional): Promise<IRecommendationComment[]> {
    const filterQuery: FilterQuery<IRecommendationComment> = filter as FilterQuery<IRecommendationComment>;
    return RecommendationComment.find(filterQuery).exec();
  }

  public async update(filter:IRecommendationCommentOptional, recommendationComment: IRecommendationCommentOptional): Promise<IRecommendationComment | null> {   
    const filterQuery: FilterQuery<IRecommendationComment> = filter as FilterQuery<IRecommendationComment>; 
    const updated = await RecommendationComment.findOneAndUpdate(filterQuery, recommendationComment, { new: true }).exec();
    return updated;
  }


  public async updateMany(filter:IRecommendationCommentOptional, recommendationComment: IRecommendationCommentOptional): Promise<number | null> {
    const filterQuery: FilterQuery<IRecommendationComment> = filter as FilterQuery<IRecommendationComment>; 
    const updated = await RecommendationComment.updateMany(filterQuery, recommendationComment, { upsert: true }).exec();
    return updated.modifiedCount;
  }

  public async delete(id: string): Promise<IRecommendationComment | null> {
    return RecommendationComment.findByIdAndDelete(id).exec();
  }
}

