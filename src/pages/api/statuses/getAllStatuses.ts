import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Status, { StatusDocumentType } from '@/models/Status';
import authenticateToken from '@/middlewares/authenticateToken';

async function getAllStatuses(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { projectId } = req.query;

  if (!projectId) {
    return res.status(400).json({ message: 'Project ID is required' });
  }

  try {
    await dbConnect();

    const statuses: StatusDocumentType[] = await Status.find({ projectId });
    const data = statuses.map((status: StatusDocumentType) => {
      const { _id, title, order, projectId } = status;
      return { id: _id, title, order, projectId };
    });

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default authenticateToken(getAllStatuses);
