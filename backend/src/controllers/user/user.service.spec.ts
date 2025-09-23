import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedpassword',
    role: 'USER',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    emplId: null,
    enName: null,
    chName: null,
    jobTitle: null,
    phone: null,
    office: null,
    deptId: null,
    deptDescr: null,
    supvEmplId: null,
    site: null,
    emplCategoryA: null,
    bg: null,
    deptRole: null,
    deptRoleAbbr: null,
    Post: [
      {
        id: 1,
        title: 'Test Post',
        content: 'Test Content',
      },
    ],
  };

  const mockUserWithoutPosts = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedpassword',
    role: 'USER',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    emplId: null,
    enName: null,
    chName: null,
    jobTitle: null,
    phone: null,
    office: null,
    deptId: null,
    deptDescr: null,
    supvEmplId: null,
    site: null,
    emplCategoryA: null,
    bg: null,
    deptRole: null,
    deptRoleAbbr: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      mockPrismaService.user.create.mockResolvedValue(mockUserWithoutPosts);

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUserWithoutPosts);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors during user creation', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const dbError = new Error('Database connection failed');
      mockPrismaService.user.create.mockRejectedValue(dbError);

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return all users with their posts', async () => {
      const mockUsers = [mockUser];
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        include: {
          Post: {
            select: {
              id: true,
              title: true,
              content: true,
            },
            orderBy: {
              id: 'desc',
            },
          },
        },
      });
      expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users exist', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors during findAll', async () => {
      const dbError = new Error('Database query failed');
      mockPrismaService.user.findMany.mockRejectedValue(dbError);

      await expect(service.findAll()).rejects.toThrow(
        'Database query failed',
      );
    });
  });

  describe('findOne', () => {
    it('should return placeholder string for now', () => {
      const result = service.findOne(1);
      expect(result).toBe('This action returns a #1 user');
    });

    it('should handle different user IDs', () => {
      expect(service.findOne(5)).toBe('This action returns a #5 user');
      expect(service.findOne(100)).toBe('This action returns a #100 user');
    });
  });

  describe('update', () => {
    it('should return placeholder string for now', () => {
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com',
      };

      const result = service.update(1, updateUserDto);
      expect(result).toBe('This action updates a #1 user');
    });

    it('should handle different user IDs and update data', () => {
      const updateUserDto: UpdateUserDto = {
        name: 'New Name',
      };

      expect(service.update(10, updateUserDto)).toBe(
        'This action updates a #10 user',
      );
    });
  });

  describe('remove', () => {
    it('should return placeholder string for now', () => {
      const result = service.remove(1);
      expect(result).toBe('This action removes a #1 user');
    });

    it('should handle different user IDs', () => {
      expect(service.remove(42)).toBe('This action removes a #42 user');
    });
  });

  describe('integration scenarios', () => {
    it('should handle user creation with related data', async () => {
      const createUserDto: CreateUserDto = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'securepassword',
      };

      const expectedUser = {
        ...mockUserWithoutPosts,
        email: 'newuser@example.com',
        name: 'New User',
      };

      mockPrismaService.user.create.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(result.email).toBe('newuser@example.com');
      expect(result.name).toBe('New User');
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
    });

    it('should retrieve users with properly ordered posts', async () => {
      const usersWithPosts = [
        {
          ...mockUser,
          Post: [
            { id: 3, title: 'Latest Post', content: 'Recent content' },
            { id: 1, title: 'Older Post', content: 'Older content' },
          ],
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(usersWithPosts);

      const result = await service.findAll();

      expect(result[0].Post).toHaveLength(2);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        include: {
          Post: {
            select: {
              id: true,
              title: true,
              content: true,
            },
            orderBy: {
              id: 'desc',
            },
          },
        },
      });
    });
  });

  describe('error handling', () => {
    it('should propagate Prisma unique constraint errors', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'password123',
      };

      const prismaError = new Error('Unique constraint failed');
      (prismaError as any).code = 'P2002';
      mockPrismaService.user.create.mockRejectedValue(prismaError);

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Unique constraint failed',
      );
    });

    it('should handle connection timeouts gracefully', async () => {
      const timeoutError = new Error('Connection timeout');
      mockPrismaService.user.findMany.mockRejectedValue(timeoutError);

      await expect(service.findAll()).rejects.toThrow('Connection timeout');
    });
  });
});
