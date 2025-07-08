import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeeService {
  private employeeData = {
    id: 1,
    name: 'Johnny Yeh',
    employeeId: '11003736',
    department: 'EX0600',
    email: 'johnny43607e@gmail.com',
  };

  private employeesList = [
    {
      id: 1,
      name: 'Johnny Yeh',
      employeeId: '11003736',
      department: 'EX0600',
      email: 'johnny43607e@gmail.com',
    },
  ];

  getEmployeeInfo() {
    return this.employeeData;
  }

  getEmployeesList() {
    return this.employeesList;
  }

  updateEmployeeInfo(updateData: any) {
    this.employeeData = { ...this.employeeData, ...updateData };
    return this.employeeData;
  }
}
