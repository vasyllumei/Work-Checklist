import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User, { UserDocumentType } from '@/models/User';
import authenticateToken from '@/middlewares/authenticateToken';

const handlerUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { firstName, lastName, role, password, iconColor } = req.body;

    try {
      await dbConnect();

      const user: UserDocumentType | null = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.password = password || user.password;
      user.role = role || user.role;
      user.iconColor = iconColor || user.iconColor;

      const updatedUser = await user.save();

      return res.status(200).json({
        user: {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
          password: updatedUser.password,
          iconColor: updatedUser.iconColor,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default authenticateToken(handlerUpdate);
