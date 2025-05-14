import { Request, Response, NextFunction } from 'express';
import { readUsers } from '../routes/users';

async function authHandler(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  console.log("Auth header: ", authHeader);
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    await fetch("https://graph.microsoft.com/v1.0/me", {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        console.log("Authorized");
        req.body.user = response.json().then((data) => {
          const users = readUsers();
          const userData = users.find((line:any) => line.startsWith(data.mail + ','));
          if (!userData) {
            return res.status(401).send({ "message": "Unauthorized" });
          }
          const user = userData.split(',');
          next();
          return user;
        });
        return;
      } else {
        console.log("Unauthorized");
        return res.status(401).send({ "message": "Unauthorized" });
      }
    });
  }
  else {
    req.body.user = null;
    next();
  }
}


export { authHandler };
