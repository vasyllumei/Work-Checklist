import { NextApiRequest, NextApiResponse } from 'next';
import User, { UserDocumentType } from '@/models/User';
import { hash } from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import { getRandomColor } from '@/utils';

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

    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    const iconColor = getRandomColor(email);
    const newUser = new User({ email, password: hashedPassword, firstName, lastName, iconColor });
    const savedUser: UserDocumentType = await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      data: { userId: savedUser._id },
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

export default handleSignUp;
