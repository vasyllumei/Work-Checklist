import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Task, { TaskDocumentType } from '@/models/Task';

const updateTasks = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    try {
      await dbConnect();

      const updatedTasks = await Promise.all(
        req.body.map(async ({ id, ...updateData }: TaskDocumentType) => {
          const task: TaskDocumentType | null = await Task.findById(id);

          if (!task) {
            return null;
          }

          Object.assign(task, updateData);

          console.log('task', task);
          return task.save();
        }),
      );

      const validUpdatedTasks = updatedTasks.filter(task => task !== null);

      console.log('Tasks updated successfully:', validUpdatedTasks);

      return res.status(200).json({
        tasks: validUpdatedTasks.map(({ title, order }) => ({ title, order })),
      });
    } catch (error) {
      console.error('Error updating tasks:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};
export default updateTasks;
