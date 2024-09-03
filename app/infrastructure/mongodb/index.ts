import mongoose from 'mongoose';

import { IDatabase } from '../IDatabase';
import { UserRepository } from './repositories/user.repository';
import { SupportRepository } from './repositories/support.repository';
import { UserSettingRepository } from './repositories/user-setting.repository';
import { AdminRepository } from './repositories/admin.repository';
import { AuthRepository } from './repositories/auth.repository';
import { PlanRepository } from './repositories/plan.repository';
import { RecommendationRepository } from './repositories/recommendation.repository';
import { RecommendationCommentRepository } from './repositories/recommendation-comment.repository';
import { UserBetRepository } from './repositories/user-bet.repository';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { UtilityRepository } from './repositories/utility.repository';
import { ArbitrageRepository } from './repositories/arbitrage.repository';

export class MongoDB implements IDatabase {
    user: UserRepository;

    support: SupportRepository;

    subscription: SubscriptionRepository;

    userBet: UserBetRepository;

    userSetting: UserSettingRepository;

    admins: AdminRepository;

    auth: AuthRepository;

    plan: PlanRepository;

    recommendation: RecommendationRepository;

    recommendationComment: RecommendationCommentRepository;

    utility: UtilityRepository;

    arbitrage: ArbitrageRepository;

  constructor() {
    this.user = new UserRepository();
    this.support = new SupportRepository();
    this.subscription = new SubscriptionRepository();
    this.userBet = new UserBetRepository();
    this.userSetting = new UserSettingRepository();
    this.admins = new AdminRepository();
    this.auth = new AuthRepository();
    this.plan = new PlanRepository();
    this.recommendation = new RecommendationRepository();
    this.recommendationComment = new RecommendationCommentRepository();
    this.utility = new UtilityRepository();
    this.arbitrage = new ArbitrageRepository();
  }  

  async connect(): Promise<void> {
    await mongoose.connect(process.env.MONGO_URI!, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
    console.log('MongoDB connected!');
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}
