import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Status, { IStatusDocument } from '@/models/Status';

export default async function getAllStatus(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const status: IStatusDocument[] = await Status.find();
    const data = status.map((status: IStatusDocument) => {
      const { _id, title, order } = status;
      return { id: _id, title, order };
    });

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
