import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Status, { StatusDocumentType } from '@/models/Status';
import authenticateToken from '@/middlewares/authenticateToken';

const updateColumn = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { title, order } = req.body;

    try {
      await dbConnect();

      const status: StatusDocumentType | null = await Status.findById(id);

      if (!status) {
        return res.status(404).json({ message: 'Status not found' });
      }

      status.title = title || status.title;
      status.order = order || status.order;
      const updatedStatus = await status.save();

      console.log('Status updated successfully:', updatedStatus);

      return res.status(200).json({
        status: {
          title: updatedStatus.title,
          order: updatedStatus.order,
        },
      });
    } catch (error) {
      console.error('Error updating status:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default authenticateToken(updateColumn);
