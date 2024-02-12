import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Task, { TaskDocumentType } from '@/models/Task';
import authenticateToken from '@/middlewares/authenticateToken';

async function getAllTasks(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const tasks: TaskDocumentType[] = await Task.find();

    const data = tasks.map((task: TaskDocumentType) => {
      const { _id, userId, assignedTo, description, title, statusId, buttonState, order } = task;
      console.log('order', order);
      return { id: _id, userId, assignedTo, statusId, title, description, buttonState, order };
    });

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
export default authenticateToken(getAllTasks);
