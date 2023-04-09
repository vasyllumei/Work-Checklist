import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function getUser(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  await dbConnect();

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { firstName, lastName, email, _id } = user;
    return res.status(200).json({ id: _id, firstName, lastName, email });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
