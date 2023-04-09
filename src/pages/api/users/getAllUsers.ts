import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User, { UserDocumentType } from '@/models/User';

export default async function getAllUsers(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const users: UserDocumentType[] = await User.find({}, '-password -__v');

    const data = users.map((user: UserDocumentType) => {
      const { _id, firstName, lastName, email, role } = user;
      return { id: _id, firstName, lastName, email, role };
    });

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
