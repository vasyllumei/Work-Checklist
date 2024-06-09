import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import authenticateToken from '@/middlewares/authenticateToken';
import Project, { ProjectDocumentType } from '@/models/Project';

const handlerUpdateProject = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { title, description, active, color } = req.body;

    try {
      await dbConnect();

      const project: ProjectDocumentType | null = await Project.findById(id);

      if (!project) {
        return res.status(404).json({ message: 'ProjectList not found' });
      }

      project.title = title || project.title;
      project.description = description || project.description;
      project.active = active || project.active;
      project.color = color || project.color;

      const updatedProject = await project.save();

      return res.status(200).json({
        project: {
          title: updatedProject.title,
          description: updatedProject.description,
          active: updatedProject.active,
          color: updatedProject.color,
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
export default authenticateToken(handlerUpdateProject);
