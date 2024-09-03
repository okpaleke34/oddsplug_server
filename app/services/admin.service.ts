// import Admin from '../models/admin.model';

// export const findAdminById = async findAdminById (id: string) => {
//   return await Admin.findById(id);
// };

export default class AdminService {

  // findAdminById = async  (id: string) => {
  //   return await Admin.findById(id);
  // };

  async getAdmins() {
    // throw new Error('Method not implemented.');
    // fetch arbitrages
    const mockAdmins = [
      { id: 1, name: 'Admin 1', email: 'admin1@example.com' },
      { id: 2, name: 'Admin 2', email: 'admin2@example.com' }
    ];
    return mockAdmins;
  }
}