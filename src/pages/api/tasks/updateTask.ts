import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Task, { TaskDocumentType } from '@/models/Task';
import authenticateToken from '@/middlewares/authenticateToken';

const handlerUpdateTask = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { statusId, title, description, buttonState, order, assignedTo } = req.body;

    try {
      await dbConnect();

      const task: TaskDocumentType | null = await Task.findById(id);

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      if (statusId !== undefined) {
        task.statusId = statusId;
      }

      task.title = title || task.title;
      task.description = description || task.description;
      task.buttonState = buttonState || task.buttonState;
      task.order = order || task.order;
      task.assignedTo = assignedTo || task.assignedTo;

      const updatedTask = await task.save();

      return res.status(200).json({
        task: {
          status: updatedTask.statusId,
          title: updatedTask.title,
          description: updatedTask.description,
          buttonState: updatedTask.buttonState,
          order: updatedTask.order,
          assignedTo: updatedTask.assignedTo,
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
export default authenticateToken(handlerUpdateTask);
