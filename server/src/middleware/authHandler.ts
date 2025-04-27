import { Request, Response, NextFunction } from 'express';

function authHandler(req: Request, _res: Response, next: NextFunction) {
    req.body.nekaj = 'nekaj'; // Example of modifying the request body
  console.log('Auth handler called');
  next(); // Call the next middleware or route handler
}


export { authHandler };