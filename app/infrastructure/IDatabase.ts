import { IUserDetailRepository } from './repositories/user-detail.interface';
import { ISupportRepository } from './repositories/support.interface';
import { IUserSettingRepository } from './repositories/user-setting.interface';
import { IAdministratorRepository } from './repositories/administrator.interface';
import { IArbitrageRepository } from './repositories/arbitrage.interface';
import { IUtilityRepository } from './repositories/utility.interface';
import { IAuthenticationRepository } from './repositories/authentication.interface';
import { IPlanRepository } from './repositories/plan.interface';
import { IExclusionRuleRepository } from './repositories/exclusion-rule.interface';
import { ISubscriptionRepository } from './repositories/subscription.interface';
import { IUserBetRepository } from './repositories/user-bet.interface';
import { IMatchedMarketRepository } from './repositories/matched-market.interface';
import { IRecommendationRepository } from './repositories/recommendation.interface';
import { IRecommendationCommentRepository } from './repositories/recommendation-comment.interface';

export interface IDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  userDetail: IUserDetailRepository;
  userBet: IUserBetRepository;
  matchedMarket: IMatchedMarketRepository;
  subscription: ISubscriptionRepository;
  support: ISupportRepository;
  userSetting: IUserSettingRepository;
  exclusionRule: IExclusionRuleRepository;
  authentication: IAuthenticationRepository;
  plan: IPlanRepository;
  recommendation: IRecommendationRepository;
  recommendationComment: IRecommendationCommentRepository;
  administrators: IAdministratorRepository;
  arbitrage: IArbitrageRepository;
  utility: IUtilityRepository;
}
