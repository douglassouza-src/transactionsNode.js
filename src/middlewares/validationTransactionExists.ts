import { NextFunction, Request, Response } from "express";
import { listUsers } from "..";
import { Transaction, User } from "../classes";

export const validationTransactionExists = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { userId, id } = request.params; 

  if (!id) {
    return response.status(400).json({ message: "ID not found, bro" });
  }

  const user = listUsers.find((user) => user.id === userId) as User;
  const transaction = user.transactions?.find((trans) => trans.id === id);

  if (!transaction) {
    return response.status(400).json({ message: "Transaction not found, bro" });
  }

  return next();
};
