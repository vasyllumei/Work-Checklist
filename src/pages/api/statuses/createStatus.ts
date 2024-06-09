import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Status, { StatusDocumentType } from '@/models/Status';
import authenticateToken from '@/middlewares/authenticateToken';
async function getNextStatusOrder() {
  const latestOrder = await Status.findOne({}, {}, { sort: { order: -1 } });
  return latestOrder ? latestOrder.order + 1 : 0;
}
const handleCreateStatus = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  await dbConnect();

  const { title } = req.body;

  try {
    const order = await getNextStatusOrder();
    const newStatus: StatusDocumentType = new Status({
      title,
      order,
    });

    const savedStatus = await newStatus.save();
    res.status(201).json({
      status: {
        id: savedStatus._id,
        title: savedStatus.title,
        order: savedStatus.order,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default authenticateToken(handleCreateStatus);
