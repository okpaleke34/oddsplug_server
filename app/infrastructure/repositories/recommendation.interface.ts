import { IRecommendation, IRecommendationOptional } from "../mongodb/models/recommendation.model";

export interface IRecommendationRepository {
  create(arbitrage: IRecommendationOptional): Promise<IRecommendation>;
  findById(id: string): Promise<IRecommendation | null>;
  findAll(): Promise<IRecommendation[]>;
  findByAggregate(aggregate: any): Promise<IRecommendation[]>;
  findByAggregate(aggregate: any): Promise<IRecommendation[]>;
  findSelection(filter:IRecommendationOptional): Promise<IRecommendation[]>;
  update(filter:IRecommendationOptional, arbitrage: IRecommendationOptional): Promise<IRecommendation | null>;
  delete(id: string): Promise<IRecommendation | null>
}