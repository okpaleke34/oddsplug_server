import db from '../infrastructure/index';
import bcrypt from 'bcryptjs';
import { IAuthentication,IAuthenticationOptional } from '../infrastructure/mongodb/models/authentication.model';
import { IResponse, IUserDTO } from '../types/global';


export default class AuthService {

  public async createAuthentication(authentication: IAuthenticationOptional): Promise<IAuthentication> {
    return db.authentication.create(authentication);
  }

  public async getAuthenticationById(id: string): Promise<IAuthentication | null> {
    return db.authentication.findById(id);
  }


  public async getAuthentication(filter: IAuthenticationOptional): Promise<IAuthentication[]> {
    return db.authentication.findSelection(filter);
  }

  public async getAllAuthentication(): Promise<IAuthentication[]> {
    return db.authentication.findAll();
  }

  public async getAggregate(aggregate: any): Promise<IAuthentication[]> {
    return db.authentication.findByAggregate(aggregate);
  }

  public async updateAuthentication(filter:any, authentication: IAuthenticationOptional): Promise<IAuthentication | null> {
    return db.authentication.update(filter, authentication);
  }

  public async deleteAuthentication(id: string): Promise<IAuthentication | null> {
    return db.authentication.delete(id);
  }

  public async getArbitrageUsersSubscriptions(minimumAlert: number): Promise<any> {
    // Aggregate pipeline to get users with active devices, active subscriptions and minimum alert greater than or equal to the minimumAlert
    const aggregate = [
      { $unwind: '$devices' }, // Deconstruct devices array to filter individual documents
      { 
        $match: {
          'devices.status': 1,
          'devices.notificationSubscription': { $ne: null } 
        } 
      },
      // Lookup to join Authentication documents with UserSetting documents
      {
        $lookup: {
          from: 'usersettings', // Name of the UserSetting collection (make sure it's correct)
          localField: '_id', // Field from Authentication collection
          foreignField: 'authId', // Field from UserSetting collection
          as: 'userSettings' // Output array field
        }
      },
      // Unwind the userSettings array to work with individual user settings
      {
        $unwind: '$userSettings'
      },
      // Match to filter only those userSettings where arbitrageAlert is greater than or equal to minimumAlert
      {
        $match: {
          'userSettings.arbitrageAlert': { $gte: minimumAlert }
        }
      },
      // Lookup to join Authentication documents with Subscription documents
      {
        $lookup: {
          from: 'subscriptions', // Name of the Subscription collection
          localField: '_id', // Field from Authentication collection
          foreignField: 'authId', // Field from Subscription collection
          as: 'subscriptions' // Output array field
        }
      },
      // Unwind the subscriptions array to work with individual subscriptions
      {
        $unwind: '$subscriptions'
      },
      // Match to filter only those subscriptions where status is 1
      {
        $match: {
          'subscriptions.status': 1
        }
      },
      // Project the required fields
      { 
        $project: { 
          _id: 1, 
          'devices.notificationSubscription': 1,
          // email: 1,
        } 
      }
    ];
    
    
    const results = await this.getAggregate(aggregate);
    // console.log(results)
    if(results.length > 0){
      const subscriptions = results.map(doc => {
        if(doc.devices !== undefined){ 
          const devices: any = doc.devices
          return devices.notificationSubscription
        }
      });
      // console.log(subscriptions)
      return subscriptions;
    }
    return [];
  }

  public async usersSubscriptions(): Promise<any> {
    const aggregate = [
      { $unwind: '$devices' }, // Deconstruct devices array to filter individual documents
      { 
        $match: {
          'devices.status': 1,
          'devices.notificationSubscription': { $ne: null } 
        } 
      },
      { 
        $project: { 
          _id: 1, 
          'devices.notificationSubscription': 1 ,
          // 'email': 1 
        } 
      }
    ];

    const results = await this.getAggregate(aggregate);
    if(results.length > 0){
      return results.map(doc => {
        if(doc.devices !== undefined){ 
          const devices: any = doc.devices
          return devices.notificationSubscription
        }
      });

    }
    return [];
  }

  public async changePassword(oldPassword: string, newPassword: string, confirmPassword: string, user: IUserDTO): Promise<IResponse> {
    try{
      if(!oldPassword || !newPassword || !confirmPassword){
        return {status:false, message: "All fields are required"}
      }
      if(newPassword !== confirmPassword){
        return {status:false, message: "Passwords do not match"}
      }
      const oldPasswordIsAccurate = await bcrypt.compare(oldPassword, user.password as string)
      if(oldPasswordIsAccurate){
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const update = await db.authentication.update({_id:user._id}, {password:hashedPassword})
        if(update){
          return {status:true, message:"Password changed successfully"}
        }
        else{
          return {status:false, message:"Error: your password was not changed, try again or use other means of support to reach us out"}
        }
      }
      else{
        return {status:false, message:"Old password is incorrect"}
      }
    }
    catch(error: any){
      return {status:false, message: error.message}
    }
  }
}