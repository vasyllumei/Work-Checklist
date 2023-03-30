import { NextApiRequest, NextApiResponse } from 'next';
import User, { UserDocument } from '../../../models/User';
import bcrypt from 'bcryptjs';
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

    // Check if user exists
    const user: UserDocument | null = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });

      return;
    }

    // Check if password is correct
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      res.status(401).json({ message: 'Invalid credentials' });

      return;
    }

    // Generate auth token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    // Generate refresh token
    const refreshToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    // Save tokens to user document
    user.token = token;
    user.refreshToken = refreshToken;
    await user.save();

    // Send tokens in response
    res.status(200).json({ token, refreshToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default handleLogin;
