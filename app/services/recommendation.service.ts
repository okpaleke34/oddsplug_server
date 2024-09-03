import mongoose from 'mongoose';
import db from '../infrastructure/index';
import { IRecommendation,IRecommendationOptional } from '../infrastructure/mongodb/models/recommendation.model';


export default class RecommendationService {

  public async createRecommendation(recommendation: IRecommendationOptional): Promise<IRecommendation> {
    return db.recommendation.create(recommendation);
  }

  public async getRecommendationById(id: string): Promise<IRecommendation | null> {
    return db.recommendation.findById(id);
  }


  // public async getRecommendation(filter: IRecommendationOptional): Promise<IRecommendation[]> {
  //   return db.recommendation.findSelection(filter);
  // }

  public async getRecommendation(recommendationId: string): Promise<any> {
    
    const recommendation = await this.getAggregate([
      // Match recommendation by ID and status
      {
        $match: { _id: new mongoose.Types.ObjectId(recommendationId), status: 1 }
      },
      
      // Lookup to get the author's username
      {
        $lookup: {
          from: 'auths',
          localField: 'authId',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $unwind: {
          path: '$author',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          topic: 1,
          description: 1,
          votes: 1,
          author: '$author.username',
        }
      },
    ]);


    // const recommendationComments = await this.getAggregate([
    //   // Match recommendation by ID and status
    //   {
    //     $match: { _id: new mongoose.Types.ObjectId(recommendationId), status: 1 }
    //   },
      
    //   // Lookup to get comments related to the recommendation
    //   {
    //     $lookup: {
    //       from: 'recommendationcomments',
    //       localField: '_id',
    //       foreignField: 'recommendationId',
    //       as: 'comments'
    //     }
    //   },
    //   {
    //     $unwind: {
    //       path: '$comments',
    //       preserveNullAndEmptyArrays: true
    //     }
    //   },
      
    //   // Lookup to get the commenter's username
    //   {
    //     $lookup: {
    //       from: 'auths',
    //       localField: 'comments.authId',
    //       foreignField: '_id',
    //       as: 'comments.user'
    //     }
    //   },
    //   {
    //     $unwind: {
    //       path: '$comments.user',
    //       preserveNullAndEmptyArrays: true
    //     }
    //   },
      
    //   // Unwind replies array within each comment
    //   {
    //     $unwind: {
    //       path: '$comments.replies',
    //       preserveNullAndEmptyArrays: true
    //     }
    //   },
      
    //   // Lookup to get the reply user's username
    //   {
    //     $lookup: {
    //       from: 'auths',
    //       localField: 'comments.replies.authId',
    //       foreignField: '_id',
    //       as: 'comments.replies.user'
    //     }
    //   },
    //   {
    //     $unwind: {
    //       path: '$comments.replies.user',
    //       preserveNullAndEmptyArrays: true
    //     }
    //   },
      
    //   // Group replies by comment ID
    //   {
    //     $group: {
    //       _id: '$comments._id',
    //       message: { $first: '$comments.message' },
    //       date: { $first: '$comments.date' },
    //       status: { $first: '$comments.status' },
    //       user: { $first: '$comments.user.username' },
    //       replies: { $push: {
    //         _id: '$comments.replies._id',
    //         message: '$comments.replies.message',
    //         date: '$comments.replies.date',
    //         status: '$comments.replies.status',
    //         user: '$comments.replies.user.username'
    //       }}
    //     }
    //   },
      
    //   // Group final results to include comments with replies and original recommendation fields
    //   {
    //     $group: {
    //       _id: '$_id',
    //       comments: { $push: {
    //         _id: '$_id',
    //         message: '$message',
    //         date: '$date',
    //         status: '$status',
    //         user: '$user',
    //         replies: '$replies'
    //       }}
    //     }
    //   }
    // ]);
    const returnData = recommendation[0];
    
    return returnData;
  }

  
  // public async getAllRecommendation(): Promise<IRecommendation[]> {
  //   return db.recommendation.findAll();
  // }

  public async getAllRecommendations(): Promise<any[]> {
    const recommendations = this.getAggregate([
      {
        $match: { status: 1},
      },
      {
        $lookup: {
          from: 'comments',          // Collection name to join
          localField: '_id',         // Field from Recommendation collection
          foreignField: 'recommendationId',    // Field from RecommendationComment collection
          as: 'comments',            // Name of the array field in result
        },
      },
      {
        $project: {
          _id: 1,
          topic: 1,
          description: 1,
          commentCount: { $size: '$comments' },  // Calculate the number of comments
          upVotesCount: {
            $size: {
              $filter: {
                input: '$votes',
                as: 'vote',
                cond: { $eq: ['$$vote.isUp', true] }
              }
            }
          },
          downVotesCount: {
            $size: {
              $filter: {
                input: '$votes',
                as: 'vote',
                cond: { $eq: ['$$vote.isUp', false] }
              }
            }
          },
        },
      },
    ]);
    return recommendations;
  }

  public async getAggregate(aggregate: any): Promise<IRecommendation[]> {
    return db.recommendation.findByAggregate(aggregate);
  }

  public async updateRecommendation(filter:any, recommendation: IRecommendationOptional): Promise<IRecommendation | null> {
    return db.recommendation.update(filter, recommendation);
  }

  public async deleteRecommendation(id: string): Promise<IRecommendation | null> {
    return db.recommendation.delete(id);
  }
}