import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Status, { StatusDocumentType } from '@/models/Status';
import authenticateToken from '@/middlewares/authenticateToken';

const updateColumns = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    try {
      await dbConnect();
      const updatedColumns = await Promise.all(
        req.body.map(async ({ id, title, order }: StatusDocumentType) => {
          const status: StatusDocumentType | null = await Status.findById(id);

          if (!status) {
            return null;
          }

          status.title = title || status.title;
          status.order = order || status.order;

          console.log('status', status);
          return status.save();
        }),
      );

      const validUpdatedColumns = updatedColumns.filter(column => column !== null);

      console.log('Columns updated successfully:', validUpdatedColumns);

      return res.status(200).json({
        columns: validUpdatedColumns.map(({ title, order }) => ({ title, order })),
      });
    } catch (error) {
      console.error('Error updating column:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default authenticateToken(updateColumns);
