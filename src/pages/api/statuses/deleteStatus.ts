import { NextApiRequest, NextApiResponse } from 'next';
import Status, { StatusDocumentType } from '../../../models/Status';
import dbConnect from '@/lib/dbConnect';
import authenticateToken from '@/middlewares/authenticateToken';

const handlerDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    query: { id },
  } = req;

  await dbConnect();

  switch (method) {
    case 'DELETE':
      try {
        const deletedStatus: StatusDocumentType | null = await Status.findByIdAndDelete(id);

        if (!deletedStatus) {
          return res.status(404).json({ success: false, message: 'Status not found' });
        }

        return res.status(200).json({ success: true, message: 'Status deleted successfully' });
      } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
      }
    default:
      return res.status(400).json({ success: false });
  }
};

export default authenticateToken(handlerDelete);
