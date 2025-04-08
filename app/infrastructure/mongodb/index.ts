import mongoose from 'mongoose';

import { IDatabase } from '../IDatabase';
import { UserDetailRepository } from './repositories/user-detail.repository';
import { SupportRepository } from './repositories/support.repository';
import { UserSettingRepository } from './repositories/user-setting.repository';
import { AdministratorRepository } from './repositories/administrator.repository';
import { AuthenticationRepository } from './repositories/authentication.repository';
import { PlanRepository } from './repositories/plan.repository';
import { RecommendationRepository } from './repositories/recommendation.repository';
import { RecommendationCommentRepository } from './repositories/recommendation-comment.repository';
import { UserBetRepository } from './repositories/user-bet.repository';
import { MatchedMarketRepository } from './repositories/matched-market.repository';
import { ExclusionRuleRepository } from './repositories/exclusion-rule.repository';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { UtilityRepository } from './repositories/utility.repository';
import { ArbitrageRepository } from './repositories/arbitrage.repository';
import config from '../../utils/config';

export class MongoDB implements IDatabase {
    userDetail: UserDetailRepository;

    support: SupportRepository;

    subscription: SubscriptionRepository;

    userBet: UserBetRepository;

    matchedMarket: MatchedMarketRepository;

    userSetting: UserSettingRepository;

    administrators: AdministratorRepository;

    authentication: AuthenticationRepository;

    plan: PlanRepository;

    exclusionRule: ExclusionRuleRepository;

    recommendation: RecommendationRepository;

    recommendationComment: RecommendationCommentRepository;

    utility: UtilityRepository;

    arbitrage: ArbitrageRepository;

  constructor() {
    this.userDetail = new UserDetailRepository();
    this.support = new SupportRepository();
    this.subscription = new SubscriptionRepository();
    this.userBet = new UserBetRepository();
    this.userSetting = new UserSettingRepository();
    this.matchedMarket = new MatchedMarketRepository();
    this.exclusionRule = new ExclusionRuleRepository();
    this.administrators = new AdministratorRepository();
    this.authentication = new AuthenticationRepository();
    this.plan = new PlanRepository();
    this.recommendation = new RecommendationRepository();
    this.recommendationComment = new RecommendationCommentRepository();
    this.utility = new UtilityRepository();
    this.arbitrage = new ArbitrageRepository();
  }  

  async connect(): Promise<void> {
    await mongoose.connect(config.db.connectionString, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
    console.log('MongoDB connected!');
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}
