import { NextApiRequest, NextApiResponse } from 'next';
import User, { UserDocument } from '@/models/User';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';

interface ISignUpRequestBody {
  email: string;
  password: string;
}

const handleSignUp = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });

    return;
  }

  const { email, password } = req.body as ISignUpRequestBody;

  try {
    await dbConnect();

    // Check if user already exists
    const existingUser: UserDocument | null = await User.findOne({ email });

    if (existingUser) {
      res.status(409).json({ message: 'User already exists' });

      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({ email, password: hashedPassword });
    const savedUser: UserDocument = await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      data: { userId: savedUser._id },
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export default handleSignUp;
