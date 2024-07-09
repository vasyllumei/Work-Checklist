import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import authenticateToken from '@/middlewares/authenticateToken';
import Project, { ProjectDocumentType } from '@/models/Project';

const updateActiveProject = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    const { projectId } = req.body;

    try {
      await dbConnect();

      if (projectId) {
        const project: ProjectDocumentType | null = await Project.findById(projectId);

        if (!project) {
          return res.status(404).json({ message: 'Project not found' });
        }

        await Project.updateMany({}, { active: false });
        project.active = true;
        await project.save();
      } else {
        await Project.updateMany({}, { active: false });
      }

      return res.status(200).json({ message: 'Active projectId updated' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default authenticateToken(updateActiveProject);
