import db from '../infrastructure/index';
import bcrypt from 'bcryptjs';
import { IAuth,IAuthOptional } from '../infrastructure/mongodb/models/auth.model';
import { IResponse, IUserDTO } from '../types/global';


export default class AuthService {

  public async createAuth(auth: IAuthOptional): Promise<IAuth> {
    return db.auth.create(auth);
  }

  public async getAuthById(id: string): Promise<IAuth | null> {
    return db.auth.findById(id);
  }


  public async getAuth(filter: IAuthOptional): Promise<IAuth[]> {
    return db.auth.findSelection(filter);
  }

  public async getAllAuth(): Promise<IAuth[]> {
    return db.auth.findAll();
  }

  public async getAggregate(aggregate: any): Promise<IAuth[]> {
    return db.auth.findByAggregate(aggregate);
  }

  public async updateAuth(filter:any, auth: IAuthOptional): Promise<IAuth | null> {
    return db.auth.update(filter, auth);
  }

  public async deleteAuth(id: string): Promise<IAuth | null> {
    return db.auth.delete(id);
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
        const update = await db.auth.update({_id:user._id}, {password:hashedPassword})
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