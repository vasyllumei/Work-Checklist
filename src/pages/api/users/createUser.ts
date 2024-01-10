import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User, { UserDocumentType } from '@/models/User';
import { getRandomColor } from '@/utils';

const handleCreateUser = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  await dbConnect();

  const { firstName, lastName, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const iconColor = getRandomColor(email);
    const newUser: UserDocumentType = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      iconColor,
    });

    const savedUser = await newUser.save();

    res.status(201).json({ user: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default handleCreateUser;
