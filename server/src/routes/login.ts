const express = require('express');
const router = express.Router();

//const jwt = require('jsonwebtoken');

const dummyMails = [
    "maj.donko@student.um.si",
    "mail2",
    "mail3",
]

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
        console.log(response.status);
        if (response.status === 200) {
            const resJson = await response.json();
            console.log(resJson.mail);
            if (dummyMails.includes(resJson)) {
                res.status(200).send('Authorized');
            }
            else{
                res.status(401).send('Unauthorized');
            }
        }
        else{
            res.status(401).send(await response.json().then((data:any) => {return data.error}));
        }
    } else {
        res.status(401).send('Unauthorized');
    }
});
export default router;