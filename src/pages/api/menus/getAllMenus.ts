import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Menu, { MenuDocumentType } from '@/models/Menu';
import authenticateToken from '@/middlewares/authenticateToken';

async function getAllMenus(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const users: MenuDocumentType[] = await Menu.find();

    const data = users.map((user: MenuDocumentType) => {
      const { _id, name, link, children, order } = user;
      return { id: _id, name, link, children, order };
    });

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
export default authenticateToken(getAllMenus);
