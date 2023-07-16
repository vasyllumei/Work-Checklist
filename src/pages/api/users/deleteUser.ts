import { NextApiRequest, NextApiResponse } from 'next';
import User, { UserDocumentType } from '../../../models/User';
import dbConnect from '@/lib/dbConnect';

const handlerDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    query: { id },
  } = req;

  await dbConnect();

  switch (method) {
    case 'DELETE':
      try {
        const deletedUser: UserDocumentType | null = await User.findByIdAndDelete(id);

        if (!deletedUser) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, message: 'User deleted successfully' });
      } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
      }
    default:
      return res.status(400).json({ success: false });
  }
};

export default handlerDelete;
