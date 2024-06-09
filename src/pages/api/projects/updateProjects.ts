import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import authenticateToken from '@/middlewares/authenticateToken';
import Project, { ProjectDocumentType } from '@/models/Project';

const updateProjects = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    try {
      await dbConnect();

      if (!Array.isArray(req.body)) {
        return res.status(400).json({ message: 'Request body should be an array of projects' });
      }

      const updatedProjects = await Promise.all(
        req.body.map(async ({ id, title, description, active, color }: ProjectDocumentType) => {
          const project: ProjectDocumentType | null = await Project.findById(id);

          if (!project) {
            return null;
          }

          project.title = title ?? project.title;
          project.description = description ?? project.description;
          project.active = active !== undefined ? active : project.active;
          project.color = color ?? project.color;

          return project.save();
        }),
      );

      const validUpdatedProjects = updatedProjects.filter(project => project !== null);

      return res.status(200).json({ projects: validUpdatedProjects });
    } catch (error) {
      console.error('Error updating projects:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default authenticateToken(updateProjects);
