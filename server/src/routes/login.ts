const express = require('express');
const router = express.Router();

//const jwt = require('jsonwebtoken');

/*const dummyMails = [
    "maj.donko@student.um.si",
    "mail2",
    "mail3",
]*/

router.get('/', async (_req:any, res:any) => {
    const authHeader = _req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        //const decodedToken = jwt.decode(token, {issuer: 'https://login.microsoftonline.com/21bd0147-4d70-40b6-b482-8f63a0cb6e44/v2.0'});
        //console.log(decodedToken.upn);
        const response = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const resJson = await response.json();
            const userList = await fetch('http://localhost:3000/api/users/list', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userListJson = await userList.json();
            console.log(userListJson);
            console.log(resJson.mail);
            console.log(userListJson.some((user: any) => user.email === resJson.mail));
            if (userListJson.some((user: any) => user.email === resJson.mail)) {
                res.status(200).send({"message": "Authorized", "email": resJson.mail, "accessLevel": userListJson[resJson.mail]});
            }
            else{
                res.status(401).send({"message": "Unauthorized"});
            }
        }
        else{
            res.status(401).send(await response.json().then((data:any) => {return data.error}));
        }
    } else {
        res.status(401).send({"message": "Unauthorized"});
    }
});
export default router;
