import { IUtility } from "../mongodb/models/utility.model";

export interface IUtilityRepository {
  findByName(name: string): Promise<IUtility | null>;
  findAll(): Promise<IUtility[]>;
}