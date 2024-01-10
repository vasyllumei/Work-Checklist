import { NextApiRequest, NextApiResponse } from 'next';
import User, { UserDocumentType } from '../../../models/User';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';

interface ILoginRequestBody {
  email: string;
  password: string;
}

const handleLogin = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { email, password } = req.body as ILoginRequestBody;

  try {
    await dbConnect();

    const user: UserDocumentType | null = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: 'Incorrect email' });
      return;
    }

    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches) {
      res.status(401).json({ message: 'Incorrect password' });
      return;
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    const refreshToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    user.token = token;
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ token, refreshToken, userId: user._id });
  } catch (error: any) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default handleLogin;
