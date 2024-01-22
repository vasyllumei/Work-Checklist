import { NextApiRequest, NextApiResponse } from 'next';
import User, { UserDocumentType } from '@/models/User';
import { hash } from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import { getRandomColor } from '@/utils';
import jwt from 'jsonwebtoken';

interface ISignUpRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const handleSignUp = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { email, password, firstName, lastName } = req.body as ISignUpRequestBody;

  try {
    await dbConnect();

    const existingUser: UserDocumentType | null = await User.findOne({ email });

    if (existingUser) {
      res.status(409).json({ message: 'User already exists' });
      return;
    }

    const newUser = new User({ email, firstName, lastName });

    newUser.password = await hash(password, 10);

    newUser.iconColor = getRandomColor(email);

    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    const refreshToken = jwt.sign({ userId: newUser._id, email: newUser.email }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    newUser.token = token;
    newUser.refreshToken = refreshToken;

    const savedUser: UserDocumentType = await newUser.save();

    res.status(200).json({ token, refreshToken, userId: savedUser._id });
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

export default handleSignUp;
