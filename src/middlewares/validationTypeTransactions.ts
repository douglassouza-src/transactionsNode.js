import { NextFunction, Request, Response } from "express";

export const validationTypeTransactions = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { type } = request.body;

  if (type !== "income" && type !== "outcome") {
    return response.status(400).json({ message: "Type should be income or outcome, bro" });
  }

  return next();
};
