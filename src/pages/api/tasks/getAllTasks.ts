import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Task, { ITaskDocument } from '@/models/Task';

export default async function getAllMenus(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const tasks: ITaskDocument[] = await Task.find();

    const data = tasks.map((user: ITaskDocument) => {
      const { _id, userId, status, assignedTo, title, description } = user;
      return { id: _id, userId, status, assignedTo, title, description };
    });

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
