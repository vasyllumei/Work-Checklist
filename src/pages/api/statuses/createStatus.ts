import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Status, { StatusDocumentType } from '@/models/Status';

const handleCreateStatus = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  await dbConnect();

  const { title, order } = req.body;

  try {
    const newStatus: StatusDocumentType = new Status({
      title,
      order,
    });

    const savedStatus = await newStatus.save();
    res.status(201).json({ id: savedStatus._id, title: savedStatus.title, order: savedStatus.order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default handleCreateStatus;
