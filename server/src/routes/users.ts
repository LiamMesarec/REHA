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

const writeUsers = (users: string[]) => {
    fs.writeFileSync(USERS_FILE, users.join('\n'), 'utf8');
};

//requirement: login v microsoft AND access-level 3
//pogledamo če je njegov email v whitelist
router.post('/add', async (req: any, res: any) => {
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
router.delete('/delete', async (req: any, res: any) => {
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
    res.json({ message: 'User deleted successfully' });
});

router.get('/list', authHandler, async (req: any, res: any) => {
    const users = readUsers();
    console.log(req.body);
    const userList = users.map(line => {
        const [email, accessLevel] = line.split(',');
        return { email, accessLevel: parseInt(accessLevel as string, 10) };
    });
    res.json(userList);
});

export default router;
