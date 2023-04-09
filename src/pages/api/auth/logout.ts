import { NextApiRequest, NextApiResponse } from 'next';
import User, { UserDocumentType } from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export interface MyNextApiRequest extends NextApiRequest {
  userId?: string | (() => string);
}

const handleLogout = async (req: MyNextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });

    return;
  }

  const userId = req.userId;

  try {
    await dbConnect();
    const user: UserDocumentType | null = await User.findById(userId);

    if (!user) {
      res.status(401).json({ message: 'User not found' });

      return;
    }

    user.token = '';
    await user.save();

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default handleLogout;
