import { Controller, Get, Put, Body } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {
    // Constructor to inject the EmployeeService
  }

  @Get('employee')
  getEmployee() {
    return this.employeeService.getEmployeeInfo();
  }

  @Get('employees')
  getEmployees() {
    return this.employeeService.getEmployeesList();
  }

  @Put('employee')
  updateEmployee(@Body() updateData: any) {
    return this.employeeService.updateEmployeeInfo(updateData);
  }
}
