import db from '../infrastructure/index';
import { IUserDetail,IUserDetailOptional } from '../infrastructure/mongodb/models/user-detail.model';


export default class UserDetailService {

  public async createUserDetail(userDetail: IUserDetailOptional): Promise<IUserDetail> {
    return db.userDetail.create(userDetail);
  }

  public async getUserDetailById(id: string): Promise<IUserDetail | null> {
    return db.userDetail.findById(id);
  }


  public async getUserDetail(filter: IUserDetailOptional): Promise<IUserDetail[]> {
    return db.userDetail.findSelection(filter);
  }

  public async getUserDetailProfile(filter: IUserDetailOptional): Promise<any> {
    const result = await this.getAggregate([
      {
        // $match: { authId: filter.authId }
        $match: filter
      },
      {
        $lookup: {
          from: 'auths', // Ensure this matches your Auth collection name
          localField: 'authId',
          foreignField: '_id',
          as: 'auth'
        }
      },
      {
        $unwind: '$auth' // This will convert the auth array into a single object
      }
    ]);

    return result[0];
  }

  public async getAggregate(aggregate: any): Promise<IUserDetail[]> {
    return db.userDetail.findByAggregate(aggregate);
  }

  public async getAllUserDetail(): Promise<IUserDetail[]> {
    return db.userDetail.findAll();
  }

  public async updateUserDetail(filter:any, userDetail: IUserDetailOptional): Promise<IUserDetail | null> {
    return db.userDetail.update(filter, userDetail);
  }

  public async deleteUserDetail(id: string): Promise<IUserDetail | null> {
    return db.userDetail.delete(id);
  }
}