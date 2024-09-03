export interface IAdminRepository {
  fetchAdmins(): Promise<any[]>;
  // Other admin-specific methods
}