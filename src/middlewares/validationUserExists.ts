import { NextFunction, Request, Response } from 'express';
import { listUsers } from '..';

export const validationUserExists = (request: Request, response: Response, next: NextFunction ) => {
    const { userId } = request.params
    if (!userId) {
        return response.status(400).json({ message: 'ID not found, bro' });
    }

    const user = listUsers.find((user) => user.id === userId);

    if (!user) {
        return response.status(400).json({ message: 'User not found, bro' });
    }

    return next();
}