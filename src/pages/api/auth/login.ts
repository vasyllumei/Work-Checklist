import { NextApiRequest, NextApiResponse } from 'next';
import User, { UserDocumentType } from '../../../models/User';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';

interface ILoginRequestBody {
  email: string;
  password: string;
}

const generateToken = (payload: object, secret: string, expiresIn: string): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

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

    const tokenPayload = {
      userId: user._id,
      email: user.email,
    };

    const token = generateToken(tokenPayload, process.env.JWT_SECRET!, '1h');
    const refreshToken = generateToken(tokenPayload, process.env.JWT_REFRESH_SECRET!, '7d');

    user.token = token;
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      user: {
        role: user.role,
        _id: user._id,
        email: user.email,
        iconColor: user.iconColor,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
      refreshToken,
    });
  } catch (error: any) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default handleLogin;
