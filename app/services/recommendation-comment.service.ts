import mongoose from 'mongoose';
import db from '../infrastructure/index';
import { IRecommendationComment,IRecommendationCommentOptional } from '../infrastructure/mongodb/models/recommendation-comment.model';


export default class RecommendationCommentService {

  public async createRecommendationComment(recommendationComment: IRecommendationCommentOptional): Promise<IRecommendationComment> {
    return db.recommendationComment.create(recommendationComment);
  }

  public async getRecommendationCommentById(id: string): Promise<IRecommendationComment | null> {
    return db.recommendationComment.findById(id);
  }

  public async getRecommendationComment(filter: IRecommendationCommentOptional): Promise<IRecommendationComment[]> {
    return db.recommendationComment.findSelection(filter);
  }

  public async getRecommendationComments(recommendationId:string): Promise<any> {
    const comments = await this.getAggregate([
      // Match comments by recommendationId and status
      {
        $match: {
          recommendationId: new mongoose.Types.ObjectId(recommendationId),
          status: 1, // Ensure comments have a status of 1
        },
      },
      
      // Lookup to get the comment author's username
      {
        $lookup: {
          from: 'auths',
          localField: 'authId',
          foreignField: '_id',
          as: 'commentUser',
        },
      },
      {
        $unwind: {
          path: '$commentUser',
          preserveNullAndEmptyArrays: true,
        },
      },
  
      // Filter replies with status 1
      {
        $addFields: {
          replies: {
            $filter: {
              input: '$replies',
              as: 'reply',
              cond: { $eq: ['$$reply.status', 1] },
            },
          },
        },
      },
  
      // Lookup to get the reply authors' usernames
      {
        $unwind: {
          path: '$replies',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'auths',
          localField: 'replies.authId',
          foreignField: '_id',
          as: 'replyUser',
        },
      },
      {
        $unwind: {
          path: '$replyUser',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          recommendationId: { $first: '$recommendationId' },
          message: { $first: '$message' },
          date: { $first: '$date' },
          status: { $first: '$status' },
          user: { $first: '$commentUser.username' },
          replies: {
            $push: {
              _id: '$replies._id',
              message: '$replies.message',
              date: '$replies.date',
              user: '$replyUser.username',
            },
          },
        },
      },
      
      // Exclude empty reply arrays (optional)
      {
        $match: {
          replies: { $ne: [] },
        },
      },
      
      // Sort comments by date (optional)
      {
        $sort: {
          date: -1,
        },
      },
    ]);
  
    return comments;
  }
  
  public async getAllRecommendationComment(): Promise<IRecommendationComment[]> {
    return db.recommendationComment.findAll();
  }

  public async getAggregate(aggregate: any): Promise<IRecommendationComment[]> {
    return db.recommendationComment.findByAggregate(aggregate);
  }

  public async updateRecommendationComment(filter:any, recommendationComment: IRecommendationCommentOptional): Promise<IRecommendationComment | null> {
    return db.recommendationComment.update(filter, recommendationComment);
  }

  public async deleteRecommendationComment(id: string): Promise<IRecommendationComment | null> {
    return db.recommendationComment.delete(id);
  }
}