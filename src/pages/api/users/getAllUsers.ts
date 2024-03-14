import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User, { UserDocumentType } from '@/models/User';
import authenticateToken from '@/middlewares/authenticateToken';

async function getAllUsers(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { role, search } = req.query;

    console.log('Role:', role);
    console.log('Search:', search);

    const filter: any = {};

    if (role) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    console.log('Filter:', filter);

    const users: UserDocumentType[] = await User.find(filter, '-password -__v');

    console.log('Users:', users);

    const data = users.map((user: UserDocumentType) => {
      const { _id, firstName, lastName, email, role, iconColor } = user;
      return { id: _id, firstName, lastName, email, role, iconColor };
    });

    console.log('Data:', data);

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default authenticateToken(getAllUsers);
