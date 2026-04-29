import { Response } from 'express';

export function apiResponse(res: Response, status: number, data?: any) {
  if (status === 204) {
    return res.status(204).send();
  }
  return res.status(status).json(data);
}