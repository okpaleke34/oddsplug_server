import db from '../infrastructure/index';
import { IUser,IUserOptional } from '../infrastructure/mongodb/models/user.model';


export default class UserService {

  public async createUser(user: IUserOptional): Promise<IUser> {
    return db.user.create(user);
  }

  public async getUserById(id: string): Promise<IUser | null> {
    return db.user.findById(id);
  }


  public async getUser(filter: IUserOptional): Promise<IUser[]> {
    return db.user.findSelection(filter);
  }

  public async getUserProfile(filter: IUserOptional): Promise<any> {
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

  public async getAggregate(aggregate: any): Promise<IUser[]> {
    return db.user.findByAggregate(aggregate);
  }

  public async getAllUser(): Promise<IUser[]> {
    return db.user.findAll();
  }

  public async updateUser(filter:any, user: IUserOptional): Promise<IUser | null> {
    return db.user.update(filter, user);
  }

  public async deleteUser(id: string): Promise<IUser | null> {
    return db.user.delete(id);
  }
}