import { Request, Response } from 'express';
import { schoolService, RegisterSchoolDto } from '../services/schoolService';
import { AuthenticatedRequest } from '../middleware/auth';

export class SchoolController {
  async registerSchool(req: Request, res: Response): Promise<void> {
    try {
      const schoolData: RegisterSchoolDto = {
        name: req.body.name,
        adminName: req.body.adminName,
        email: req.body.email,
        password: req.body.password,
        certificate: req.body.certificate,
      };

      const school = await schoolService.registerSchool(schoolData);

      res.status(201).json({
        success: true,
        data: { school },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async getSchoolProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req as AuthenticatedRequest;

      const school = await schoolService.getSchoolByUserId(userId);

      if (!school) {
        throw new Error('School profile not found');
      }

      res.status(200).json({
        success: true,
        data: { school },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async getAllSchools(req: Request, res: Response): Promise<void> {
    try {
      const schools = await schoolService.getAllSchools();

      res.status(200).json({
        success: true,
        data: { schools },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async updateSchool(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req as AuthenticatedRequest;

      const school = await schoolService.getSchoolByUserId(userId);

      if (!school) {
        throw new Error('School profile not found');
      }

      const updatedSchool = await schoolService.updateSchool(school.id, req.body);

      res.status(200).json({
        success: true,
        data: { school: updatedSchool },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  }
}

export const schoolController = new SchoolController();

