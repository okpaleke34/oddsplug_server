import { IUserRepository } from './repositories/user.interface';
import { ISupportRepository } from './repositories/support.interface';
import { IUserSettingRepository } from './repositories/user-setting.interface';
import { IAdminRepository } from './repositories/admin.interface';
import { IArbitrageRepository } from './repositories/arbitrage.interface';
import { IUtilityRepository } from './repositories/utility.interface';
import { IAuthRepository } from './repositories/auth.interface';
import { IPlanRepository } from './repositories/plan.interface';
import { ISubscriptionRepository } from './repositories/subscription.interface';
import { IUserBetRepository } from './repositories/user-bet.interface';
import { IRecommendationRepository } from './repositories/recommendation.interface';
import { IRecommendationCommentRepository } from './repositories/recommendation-comment.interface';

export interface IDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  user: IUserRepository;
  userBet: IUserBetRepository;
  subscription: ISubscriptionRepository;
  support: ISupportRepository;
  userSetting: IUserSettingRepository;
  auth: IAuthRepository;
  plan: IPlanRepository;
  recommendation: IRecommendationRepository;
  recommendationComment: IRecommendationCommentRepository;
  admins: IAdminRepository;
  arbitrage: IArbitrageRepository;
  utility: IUtilityRepository;
}
