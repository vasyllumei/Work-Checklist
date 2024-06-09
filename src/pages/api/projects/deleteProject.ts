import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import authenticateToken from '@/middlewares/authenticateToken';
import Project, { ProjectDocumentType } from '@/models/Project';

const handlerDeleteProject = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    query: { id },
  } = req;

  await dbConnect();

  switch (method) {
    case 'DELETE':
      try {
        const deletedProject: ProjectDocumentType | null = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
          return res.status(404).json({ success: false, message: 'ProjectList not found' });
        }

        return res.status(200).json({ success: true, message: 'ProjectList deleted successfully' });
      } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
      }
    default:
      return res.status(400).json({ success: false });
  }
};

export default authenticateToken(handlerDeleteProject);
