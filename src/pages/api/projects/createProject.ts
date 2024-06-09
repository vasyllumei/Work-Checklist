import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import authenticateToken from '@/middlewares/authenticateToken';
import Project, { ProjectDocumentType } from '@/models/Project';

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

    console.log('New project object:', newProject);

    const savedProject = await newProject.save();

    await savedProject.save();

    console.log('Saved project with color:', savedProject);

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
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default authenticateToken(handleCreateProject);
