import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Task, { TaskDocumentType } from '@/models/Task';

const handlerUpdateTaskStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { statusId } = req.body;

    try {
      await dbConnect();

      const task: TaskDocumentType | null = await Task.findById(id);

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      if (statusId) {
        task.statusId = statusId;
      }

      const updatedTask = await task.save();

      return res.status(200).json({
        task: {
          status: updatedTask.statusId,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handlerUpdateTaskStatus;
