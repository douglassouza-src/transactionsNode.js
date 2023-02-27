import { NextFunction, Request, Response } from 'express';

export const validationDataTransactions = (request: Request, response: Response, next: NextFunction ) => {
    const { title, value, type } = request.body;

    if (!title || !value || !type) {
        return response.status(400).json({ message: 'Invalid format, bro' });
    }


     return next()
}