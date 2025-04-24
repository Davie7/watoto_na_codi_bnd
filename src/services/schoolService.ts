import { PrismaClient, School, UserType } from '@prisma/client';
import { authService } from './authService';

const prisma = new PrismaClient();

export interface RegisterSchoolDto {
  name: string;
  adminName: string;
  email: string;
  password: string;
  certificate?: string;
}

export class SchoolService {
  async registerSchool(schoolData: RegisterSchoolDto): Promise<School> {
    // First register the user
    const { user } = await authService.register({
      email: schoolData.email,
      password: schoolData.password,
      userType: UserType.SCHOOL,
    });

    // Then create the school profile
    const school = await prisma.school.create({
      data: {
        name: schoolData.name,
        adminName: schoolData.adminName,
        certificate: schoolData.certificate,
        userId: user.id,
      },
    });

    return school;
  }

  async getSchoolByUserId(userId: string): Promise<School | null> {
    return prisma.school.findUnique({
      where: { userId },
    });
  }

  async getAllSchools(): Promise<School[]> {
    return prisma.school.findMany();
  }

  async updateSchool(schoolId: string, data: Partial<School>): Promise<School> {
    return prisma.school.update({
      where: { id: schoolId },
      data,
    });
  }
}

export const schoolService = new SchoolService();