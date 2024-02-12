import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Menu, { MenuDocumentType } from '@/models/Menu';
import authenticateToken from '@/middlewares/authenticateToken';

const handlerUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { name, link, order, children } = req.body;

    try {
      await dbConnect();

      const menu: MenuDocumentType | null = await Menu.findById(id);

      if (!menu) {
        return res.status(404).json({ message: 'Menu not found' });
      }

      menu.name = name || menu.name;
      menu.link = link || menu.link;
      menu.order = order || menu.order;
      menu.children = children || menu.children;

      const updatedMenu = await menu.save();

      return res.status(200).json({
        menu: {
          name: updatedMenu.name,
          link: updatedMenu.link,
          order: updatedMenu.order,
          children: updatedMenu.children,
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

export default authenticateToken(handlerUpdate);
