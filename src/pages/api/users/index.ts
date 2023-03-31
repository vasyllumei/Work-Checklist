import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '../../../models/User';
import { CreateUserType } from '@/types/User';
// import authenticateToken from '@/middlewares/authenticateToken';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const users = await User.find({});

        res.status(200).json({ data: users });
      } catch (error) {
        res.status(400).json({ message: 'Internal server error' });
      }
      break;
    case 'POST':
      try {
        const user = await User.create(req.body as CreateUserType);

        res.status(201).json({ data: user });
      } catch (error) {
        res.status(400).json({ message: 'Internal server error' });
      }
      break;
    default:
      res.status(400).json({ message: 'Internal server error' });
      break;
  }
}

// export default authenticateToken(handler);
export default handler;
