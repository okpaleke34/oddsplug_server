import { IRecommendationComment, IRecommendationCommentOptional } from "../mongodb/models/recommendation-comment.model";

export interface IRecommendationCommentRepository {
  create(arbitrage: IRecommendationCommentOptional): Promise<IRecommendationComment>;
  findById(id: string): Promise<IRecommendationComment | null>;
  findAll(): Promise<IRecommendationComment[]>;
  findByAggregate(aggregate: any): Promise<IRecommendationComment[]>;
  findSelection(filter:IRecommendationCommentOptional): Promise<IRecommendationComment[]>;
  update(filter:IRecommendationCommentOptional, arbitrage: IRecommendationCommentOptional): Promise<IRecommendationComment | null>;
  delete(id: string): Promise<IRecommendationComment | null>
}