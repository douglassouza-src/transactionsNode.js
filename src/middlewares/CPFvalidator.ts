import { NextFunction, Request, Response } from 'express';
import { listUsers } from '..';

export const CPFvalidator = (request: Request, response: Response, next: NextFunction) => {
  const { cpf } = request.body;

  const newCPF = cpf.replace(/[^a-zA-Z0-9]/g, '');

  if (listUsers.some((user) => user.cpf === newCPF)) {
    return response.status(400).json({ message: 'CPF already exist, bro' });
  }

  return next();
};
