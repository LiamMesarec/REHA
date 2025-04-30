import express  from 'express';
import fs from 'fs';
import path from 'path';
import { authHandler } from '../middleware/authHandler';

const router = express.Router();
const USERS_FILE = path.join(__dirname, 'users.enc');

const readUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return [];
    return fs.readFileSync(USERS_FILE, 'utf8').split('\n').filter(line => line);
};

export { readUsers };

const writeUsers = (users: string[]) => {
    fs.writeFileSync(USERS_FILE, users.join('\n'), 'utf8');
};

//requirement: login v microsoft AND access-level 3
//pogledamo če je njegov email v whitelist
router.post('/add',authHandler, async (req: any, res: any) => {
    const user = await req.body.user;
    if (user == null) {
        return res.status(401).send({ "message": "Unauthorized" });
    }
    
    if (user[1] < 3) {
        return res.status(401).send({ "message": "Unauthorized" });
    }
    const { email, accessLevel } = req.body;
    console.log(req.body);
    if (!email || ![1, 2, 3].includes(accessLevel)) {
        return res.status(400).json({ error: 'Invalid email or access level' });
    }

    const users = readUsers();
    if (users.some(line => line.startsWith(email + ','))) {
        return res.status(409).json({ error: 'User already exists' });
    }

    users.push(`${email},${accessLevel}`);
    writeUsers(users);
    res.json({ message: 'User added successfully' });
});

// Delete user by email
router.delete('/delete', authHandler, async (req: any, res: any) => {
    const user = await req.body.user;
    if (user == null) {
        return res.status(401).send({ "message": "Unauthorized" });
    }
    
    if (user[1] < 3) {
        return res.status(401).send({ "message": "Unauthorized" });
    }
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    let users = readUsers();
    const updatedUsers = users.filter(line => !line.startsWith(email + ','));

    if (users.length === updatedUsers.length) {
        return res.status(404).json({ error: 'User not found' });
    }

    writeUsers(updatedUsers);
    res.status(200).json({ message: 'User deleted successfully' });
});

router.get('/list', authHandler, async (req: any, res: any) => {
    const users = readUsers();
    const user = await req.body.user;
    if (user == null) {
        return res.status(401).send({ "message": "Unauthorized" });
    }
    
    if (user[1] < 3) {
        return res.status(401).send({ "message": "Unauthorized" });
    }

    const userList = users.map(line => {
        const [email, accessLevel] = line.split(',');
        return { email, accessLevel: parseInt(accessLevel as string, 10) };
    });
    
    res.json(userList);
});

router.get('/me', authHandler, async (req: any, res: any) => {
    const user = await req.body.user;
    if (user == null) {
        return res.status(401).send({ "message": "Unauthorized" });
    }
    
    res.json({"email":user[0], "accessLevel": user[1]});
});

export default router;
