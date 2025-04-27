import { Request, Response, NextFunction } from 'express';

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
        req.body.mail = response.json().then((data) => {
          next();
          return data.mail;
        });
        return;
      } else {
        console.log("Unauthorized");
        return res.status(401).send({ "message": "Unauthorized" });
      }
    });
  }
  else {

  req.body.mail = null;
  console.log('Auth handler called');
  next(); // Call the next middleware or route handler
  }
}


export { authHandler };