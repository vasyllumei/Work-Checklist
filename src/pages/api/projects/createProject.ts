import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import authenticateToken from '@/middlewares/authenticateToken';
import Project, { ProjectDocumentType } from '@/models/Project';
import Status from '@/models/Status';

const handleCreateProject = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  await dbConnect();

  const { title, description, active, color } = req.body;

  try {
    const newProject: ProjectDocumentType = new Project({
      title,
      description,
      active,
      color,
    });

    const savedProject = await newProject.save();

    const defaultStatuses = [
      { title: 'Backlog', order: 0, projectId: savedProject._id.toString() },
      { title: 'To Do', order: 1, projectId: savedProject._id.toString() },
      { title: 'In Progress', order: 2, projectId: savedProject._id.toString() },
      { title: 'Done', order: 3, projectId: savedProject._id.toString() },
    ];

    const statusPromises = defaultStatuses.map(status => new Status(status).save());
    await Promise.all(statusPromises);

    res.status(201).json({
      project: {
        id: savedProject._id,
        description: savedProject.description,
        title: savedProject.title,
        active: savedProject.active,
        color: savedProject.color,
      },
    });
  } catch (error) {
    console.error('Error creating projectId:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default authenticateToken(handleCreateProject);
