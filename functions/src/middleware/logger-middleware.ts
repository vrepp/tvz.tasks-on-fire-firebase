/**
 * Logger Middleware
 * 
 * @author Valentin Rep
 * @copyright © 2020. All rights reserved.
 * @version 1.0
 */

import { Request, Response, NextFunction } from 'express'

export const loggerMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    console.log('=> [%s] %s', request.method, request.path);
    next();
}