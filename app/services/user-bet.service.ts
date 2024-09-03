import db from '../infrastructure/index';
import { IUserBet,IUserBetOptional } from '../infrastructure/mongodb/models/user-bet.model';


export default class UserBetService {

  public async createUserBet(userBet: IUserBetOptional): Promise<IUserBet> {
    return db.userBet.create(userBet);
  }

  public async getUserBetById(id: string): Promise<IUserBet | null> {
    return db.userBet.findById(id);
  }

  public async getBetHistories(filter: IUserBetOptional, limit: number): Promise<any> {
    const results = await this.getAggregate([
      {
        $match: filter,
      },
      { $limit: limit }, // Limit the result to 10 documents
      {
        $lookup: {
          from: 'arbitrages',  // Arbitrage collection name
          localField: 'betId',
          foreignField: '_id',
          as: 'matchInfo',
        },
      },
      {
        $unwind: {
          path: '$matchInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
          $addFields: {
              'matchInfo.history': {
                  $cond: {
                      if: { $gt: ['$historyLength', 0] },
                      then: { $arrayElemAt: ['$matchInfo.history', '$historyLength'] },
                      else: { $arrayElemAt: ['$matchInfo.history', 0] },
                  },
              },
          },
      },
      {
          $project: {
              _id: 1,
              authId: 1,
              betId: 1,
              betType: 1,
              historyLength: 1,
              calculatorValues: 1,
              status: 1,              
              createdAt: 1,
              matchInfo: {
                  tournament: 1,
                  marketCode: 1,
                  arbPercentage: 1,
                  bookmakers: 1,
                  firstScannedAt: 1,
                  sport: 1,
                  startAt: 1,
                  history: 1,
              },
          },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    return results;
  }

  public async getUserBet(filter: IUserBetOptional): Promise<IUserBet[]> {
    return db.userBet.findSelection(filter);
  }

  public async getAllUserBet(): Promise<IUserBet[]> {
    return db.userBet.findAll();
  }

  public async getAggregate(aggregate: any): Promise<IUserBet[]> {
    return db.userBet.findByAggregate(aggregate);
  }

  public async updateUserBet(filter:any, userBet: IUserBetOptional): Promise<IUserBet | null> {
    return db.userBet.update(filter, userBet);
  }

  public async deleteUserBet(id: string): Promise<IUserBet | null> {
    return db.userBet.delete(id);
  }
}