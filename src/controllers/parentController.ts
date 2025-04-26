// src/controllers/parentController.ts
import { Request, Response } from 'express';
import { parentService, RegisterParentDto, AddChildToParentDto } from '../services/parentService';
import { AuthenticatedRequest } from '../middleware/auth';

export class ParentController {
  async registerParent(req: Request, res: Response): Promise<void> {
    try {
      const parentData: RegisterParentDto = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
      };

      const parent = await parentService.registerParent(parentData);

      res.status(201).json({
        success: true,
        data: { parent },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async getParentProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req as AuthenticatedRequest;
      const parent = await parentService.getParentByUserId(userId);

      if (!parent) {
        throw new Error('Parent profile not found');
      }

      res.status(200).json({
        success: true,
        data: { parent },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async updateParent(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req as AuthenticatedRequest;
      const parent = await parentService.getParentByUserId(userId);

      if (!parent) {
        throw new Error('Parent profile not found');
      }

      const updatedParent = await parentService.updateParent(parent.id, req.body);

      res.status(200).json({
        success: true,
        data: { parent: updatedParent },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async addChildToParent(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req as AuthenticatedRequest;
      const parent = await parentService.getParentByUserId(userId);

      if (!parent) {
        throw new Error('Parent profile not found');
      }

      const childData: AddChildToParentDto = {
        parentId: parent.id,
        childId: req.body.childId,
        relationToStudent: req.body.relationToStudent,
      };

      const updatedParent = await parentService.addChildToParent(childData);

      res.status(200).json({
        success: true,
        data: { parent: updatedParent },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async getParentChildren(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req as AuthenticatedRequest;
      const parent = await parentService.getParentByUserId(userId);

      if (!parent) {
        throw new Error('Parent profile not found');
      }

      const children = await parentService.getParentChildren(parent.id);

      res.status(200).json({
        success: true,
        data: { children },
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

export const parentController = new ParentController();