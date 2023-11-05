import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Task, { TaskDocumentType } from '@/models/Task';

const handleCreateTask = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  await dbConnect();

  const { userId, assignedTo, title, description, statusId } = req.body;

  try {
    const newTask: TaskDocumentType = new Task({
      userId,
      assignedTo,
      title,
      description,
      statusId,
    });

    const savedTask = await newTask.save();
    res.status(201).json({ task: savedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default handleCreateTask;
