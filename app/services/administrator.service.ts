// import Administrator from '../models/administrator.model';

// export const findAdminById = async findAdminById (id: string) => {
//   return await Administrator.findById(id);
// };

export default class AdministratorService {

  // findAdminById = async  (id: string) => {
  //   return await Administrator.findById(id);
  // };

  async getAdministrators() {
    // throw new Error('Method not implemented.');
    // fetch arbitrages
    const mockAdministrators = [
      { id: 1, name: 'Admin 1', email: 'admin1@example.com' },
      { id: 2, name: 'Admin 2', email: 'admin2@example.com' }
    ];
    return mockAdministrators;
  }
}