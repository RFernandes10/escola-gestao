import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { EmployeeService } from '../services/employeeService';
import { apiResponse } from '../utils/apiResponse';

const service = new EmployeeService();

export class EmployeeController {
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;
      const department = req.query.department as string | undefined;

      const result = await service.list(page, limit, search, department);
      return apiResponse(res, 200, result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const employee = await service.getById(id);
      return apiResponse(res, 200, employee);
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const photoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
      const employee = await service.create(req.body, photoUrl);
      return apiResponse(res, 201, employee);
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const photoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
      const employee = await service.update(id, req.body, photoUrl);
      return apiResponse(res, 200, employee);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await service.delete(id);
      return apiResponse(res, 204);
    } catch (err) {
      next(err);
    }
  }

  async toggleStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const employee = await service.toggleStatus(id, status);
      return apiResponse(res, 200, employee);
    } catch (err) {
      next(err);
    }
  }
}