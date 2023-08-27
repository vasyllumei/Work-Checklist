import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Menu, { MenuDocumentType } from '@/models/Menu';

const handleCreateMenu = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  await dbConnect();

  const { name, link, order, children } = req.body;

  try {
    const newMenu: MenuDocumentType = new Menu({
      name,
      link,
      order,
      children,
    });

    const savedMenu = await newMenu.save();
    res.status(201).json({ menu: savedMenu });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default handleCreateMenu;
