import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('employee')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {
    // Constructor to inject the EmployeeService
  }

  @Get('employee')
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({
    summary: '獲取員工資訊',
    description: '獲取單一員工的詳細資訊',
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取員工資訊',
  })
  @ApiResponse({
    status: 401,
    description: '未授權',
  })
  @ApiResponse({
    status: 403,
    description: '權限不足',
  })
  getEmployee() {
    return this.employeeService.getEmployeeInfo();
  }

  @Get('employees')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: '獲取員工列表',
    description: '獲取所有員工的列表（僅管理員）',
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取員工列表',
  })
  @ApiResponse({
    status: 401,
    description: '未授權',
  })
  @ApiResponse({
    status: 403,
    description: '權限不足',
  })
  getEmployees() {
    return this.employeeService.getEmployeesList();
  }

  @Put('employee')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: '更新員工資訊',
    description: '更新員工的詳細資訊（僅管理員）',
  })
  @ApiResponse({
    status: 200,
    description: '成功更新員工資訊',
  })
  @ApiResponse({
    status: 401,
    description: '未授權',
  })
  @ApiResponse({
    status: 403,
    description: '權限不足',
  })
  updateEmployee(@Body() updateData: any) {
    return this.employeeService.updateEmployeeInfo(updateData);
  }
}
