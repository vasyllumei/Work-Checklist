import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Task, { TaskDocumentType } from '@/models/Task';

const handleCreateTask = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  await dbConnect();

  const { userId, assignedTo, title, description, statusId, buttonState } = req.body;
  console.log('Received data:', userId, assignedTo, title, description, statusId, buttonState);

  try {
    const newTask: TaskDocumentType = new Task({
      userId,
      assignedTo,
      title,
      description,
      statusId,
      buttonState,
    });

    console.log('New task object:', newTask);

    const savedTask = await newTask.save();
    console.log('Saved task:', savedTask);
    res.status(201).json({
      task: {
        id: savedTask._id,
        userId: savedTask.userId,
        assignedTo: savedTask.assignedTo,
        description: savedTask.description,
        title: savedTask.title,
        statusId: savedTask.statusId,
        buttonState: savedTask.buttonState,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default handleCreateTask;
