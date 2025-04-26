// src/services/parentService.ts
import { PrismaClient, Parent, UserType } from '@prisma/client';
import { authService } from './authService';

const prisma = new PrismaClient();

export interface RegisterParentDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}

export interface AddChildToParentDto {
  parentId: string;
  childId: string;
  relationToStudent?: string;
}

export class ParentService {
  async registerParent(parentData: RegisterParentDto): Promise<Parent> {
    // First register the user
    const { user } = await authService.register({
      email: parentData.email,
      password: parentData.password,
      userType: UserType.PARENT,
    });

    // Then create the parent profile
    const parent = await prisma.parent.create({
      data: {
        firstName: parentData.firstName,
        lastName: parentData.lastName,
        phoneNumber: parentData.phoneNumber,
        address: parentData.address,
        userId: user.id,
      },
    });

    return parent;
  }

  async getParentByUserId(userId: string): Promise<Parent | null> {
    return prisma.parent.findUnique({
      where: { userId },
      include: {
        students: true,
      },
    });
  }

  async getParentById(parentId: string): Promise<Parent | null> {
    return prisma.parent.findUnique({
      where: { id: parentId },
      include: {
        students: true,
      },
    });
  }

  async updateParent(parentId: string, data: Partial<Parent>): Promise<Parent> {
    return prisma.parent.update({
      where: { id: parentId },
      data,
    });
  }

  async addChildToParent(data: AddChildToParentDto): Promise<Parent> {
    const { parentId, childId, relationToStudent } = data;
    
    // Update student record to link to parent
    await prisma.student.update({
      where: { id: childId },
      data: { parentId },
    });

    // If relation info provided, update parent info
    if (relationToStudent) {
      await prisma.parent.update({
        where: { id: parentId },
        data: { relationToStudent },
      });
    }

    // Return updated parent with students
    return this.getParentById(parentId) as Promise<Parent>;
  }

  async getParentChildren(parentId: string) {
    return prisma.student.findMany({
      where: { parentId },
    });
  }
}

export const parentService = new ParentService();