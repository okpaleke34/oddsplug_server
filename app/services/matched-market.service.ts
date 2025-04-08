import db from '../infrastructure/index';
import { IMatchedMarket,IMatchedMarketOptional } from '../infrastructure/mongodb/models/matched-market.model';


export default class MatchedMarketService {

  public async createMatchedMarket(matchedMarket: IMatchedMarketOptional): Promise<IMatchedMarket> {
    return db.matchedMarket.create(matchedMarket);
  }

  public async getMatchedMarketById(id: string): Promise<IMatchedMarket | null> {
    return db.matchedMarket.findById(id);
  }

  public async getBetHistories(filter: IMatchedMarketOptional, limit: number): Promise<any> {
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

  public async getMatchedMarket(filter: IMatchedMarketOptional): Promise<IMatchedMarket[]> {
    return db.matchedMarket.findSelection(filter);
  }

  public async getMatchedMarketData(filter: IMatchedMarketOptional): Promise<IMatchedMarket[]> {
    return db.matchedMarket.findSelection(filter);
  }

  public async getAllMatchedMarket(): Promise<IMatchedMarket[]> {
    return db.matchedMarket.findAll();
  }

  public async getAggregate(aggregate: any): Promise<IMatchedMarket[]> {
    return db.matchedMarket.findByAggregate(aggregate);
  }

  public async updateMatchedMarket(filter:any, matchedMarket: IMatchedMarketOptional): Promise<IMatchedMarket | null> {
    return db.matchedMarket.update(filter, matchedMarket);
  }

  public async deleteMatchedMarket(id: string): Promise<IMatchedMarket | null> {
    return db.matchedMarket.delete(id);
  }
}