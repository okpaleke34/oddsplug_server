export interface IAdministratorRepository {
  fetchAdministrators(): Promise<any[]>;
  // Other admin-specific methods
}