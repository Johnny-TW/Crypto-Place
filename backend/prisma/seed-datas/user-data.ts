import { Role } from '@prisma/client'

export interface UserSeedData {
  email: string
  name: string
  password: string
  password_confirmation?: string
  role?: Role
  isActive?: boolean
  emplId?: string
  enName?: string
  chName?: string
  jobTitle?: string
  phone?: string
  office?: string
  deptId?: string
  deptDescr?: string
  supvEmplId?: string
  site?: string
  emplCategoryA?: string
  bg?: string
  fnLvl1?: string
  fnLvl2?: string
  deptRoleName?: string
  deptRoleAbbr?: string
}

export const adminUsers: UserSeedData[] = [
  {
    email: 'admin@cryptoplace.com',
    name: 'System Administrator',
    password: 'admin123',
    role: Role.ADMIN,
    emplId: 'EMP001',
    enName: 'John Smith',
    chName: '約翰·史密斯',
    jobTitle: 'System Administrator',
    phone: '+1-555-0101',
    office: 'HQ-101',
    deptId: 'IT001',
    deptDescr: 'Information Technology',
    supvEmplId: null,
    site: 'Headquarters',
    emplCategoryA: 'Full-Time',
    bg: 'Technology',
    fnLvl1: 'IT Operations',
    fnLvl2: 'System Administration',
    deptRoleName: 'Administrator',
    deptRoleAbbr: 'ADMIN',
  },
  {
    email: 'manager@cryptoplace.com',
    name: 'Product Manager',
    password: 'admin123',
    role: Role.ADMIN,
    emplId: 'EMP002',
    enName: 'David Chen',
    chName: '陳大衛',
    jobTitle: 'Product Manager',
    phone: '+1-555-0102',
    office: 'HQ-201',
    deptId: 'PROD001',
    deptDescr: 'Product Management',
    supvEmplId: 'EMP001',
    site: 'Headquarters',
    emplCategoryA: 'Full-Time',
    bg: 'Business',
    fnLvl1: 'Product Development',
    fnLvl2: 'Product Management',
    deptRoleName: 'Manager',
    deptRoleAbbr: 'MGR',
  }
]

export const regularUsers: UserSeedData[] = [
  {
    name: 'Alice Johnson',
    email: 'alice@cryptoplace.com',
    password: 'user123',
    role: Role.USER,
    emplId: 'EMP003',
    enName: 'Alice Johnson',
    chName: '愛麗絲·約翰遜',
    jobTitle: 'Frontend Developer',
    phone: '+1-555-0103',
    office: 'HQ-301',
    deptId: 'DEV001',
    deptDescr: 'Development',
    supvEmplId: 'EMP002',
    site: 'Headquarters',
    emplCategoryA: 'Full-Time',
    bg: 'Technology',
    fnLvl1: 'Software Development',
    fnLvl2: 'Frontend Development',
    deptRoleName: 'Developer',
    deptRoleAbbr: 'DEV',
  },
  {
    name: 'Bob Wilson',
    email: 'bob@cryptoplace.com',
    password: 'user123',
    role: Role.USER,
    emplId: 'EMP004',
    enName: 'Bob Wilson',
    chName: '鮑勃·威爾遜',
    jobTitle: 'Backend Developer',
    phone: '+1-555-0104',
    office: 'HQ-302',
    deptId: 'DEV001',
    deptDescr: 'Development',
    supvEmplId: 'EMP002',
    site: 'Headquarters',
    emplCategoryA: 'Full-Time',
    bg: 'Technology',
    fnLvl1: 'Software Development',
    fnLvl2: 'Backend Development',
    deptRoleName: 'Developer',
    deptRoleAbbr: 'DEV',
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@cryptoplace.com',
    password: 'user123',
    role: Role.USER,
    emplId: 'EMP005',
    enName: 'Charlie Brown',
    chName: '查理·布朗',
    jobTitle: 'QA Engineer',
    phone: '+1-555-0105',
    office: 'HQ-303',
    deptId: 'QA001',
    deptDescr: 'Quality Assurance',
    supvEmplId: 'EMP002',
    site: 'Headquarters',
    emplCategoryA: 'Full-Time',
    bg: 'Technology',
    fnLvl1: 'Quality Assurance',
    fnLvl2: 'Test Engineering',
    deptRoleName: 'QA Engineer',
    deptRoleAbbr: 'QA',
  }
]

export const users = [...adminUsers, ...regularUsers]
