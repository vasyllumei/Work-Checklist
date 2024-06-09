import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Project, { ProjectDocumentType } from '@/models/Project';
import authenticateToken from '@/middlewares/authenticateToken';

async function getAllProjects(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const project: ProjectDocumentType[] = await Project.find();

    const data = project.map((project: ProjectDocumentType) => {
      const { _id, title, description, active, color } = project;
      return { id: _id, title, description, active, color };
    });

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
export default authenticateToken(getAllProjects);
