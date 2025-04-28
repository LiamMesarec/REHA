import { authHandler } from '../middleware/authHandler';
const express = require('express');
const router = express.Router();

//const jwt = require('jsonwebtoken');

/*const dummyMails = [
    "maj.donko@student.um.si",
    "mail2",
    "mail3",
]*/

router.get('/', authHandler, async (req:any, res:any) => {
    const user = await req.body.user;
    if (user == null) {
        return res.status(401).send({ "message": "Unauthorized" });
    }
    
    if (user[1] < 3) {
        return res.status(401).send({ "message": "Unauthorized" });
    }

    res.status(200).send({"message": "Authorized", "email": user[0], "accessLevel": user[1]});
});
export default router;
