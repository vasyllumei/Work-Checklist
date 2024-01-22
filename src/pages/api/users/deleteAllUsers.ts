import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../models/User';
import dbConnect from '@/lib/dbConnect';
interface CustomDeleteResult {
  acknowledged: boolean;
  deletedCount?: number;
}
const handlerDeleteAllUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;
  const userIds = body?.userIds;

  if (!userIds) {
    return res.status(400).json({ success: false, message: 'userIds missing in request body' });
  }

  await dbConnect();

  try {
    switch (method) {
      case 'DELETE':
        const deletionResult: CustomDeleteResult = await User.deleteMany({ _id: { $in: userIds } });

        if (deletionResult.acknowledged && deletionResult.deletedCount !== undefined) {
          console.log('Deletion Result:', deletionResult);

          if (deletionResult.deletedCount > 0) {
            return res.status(200).json({ success: true, message: 'Users deleted successfully' });
          } else {
            return res.status(404).json({ success: false, message: 'Users not found for deletion' });
          }
        } else {
          console.error('Unexpected deletion result:', deletionResult);
          return res.status(500).json({ success: false, message: 'Unexpected deletion result' });
        }

      default:
        return res.status(400).json({ success: false, message: 'Bad Request' });
    }
  } catch (error) {
    console.error('Error deleting users:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export default handlerDeleteAllUsers;
