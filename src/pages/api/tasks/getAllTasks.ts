import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Task, { TaskDocumentType } from '@/models/Task';

export default async function getAllTasks(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const tasks: TaskDocumentType[] = await Task.find();
    console.log(tasks);
    const data = tasks.map((task: TaskDocumentType) => {
      const { _id, userId, assignedTo, description, title, status } = task;
      return { id: _id, userId, assignedTo, status, title, description };
    });

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
