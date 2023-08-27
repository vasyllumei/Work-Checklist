import { NextApiRequest, NextApiResponse } from 'next';
import Menu, { MenuDocumentType } from '../../../models/Menu';
import dbConnect from '@/lib/dbConnect';

const handlerDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    query: { id },
  } = req;

  await dbConnect();

  switch (method) {
    case 'DELETE':
      try {
        const deletedMenu: MenuDocumentType | null = await Menu.findByIdAndDelete(id);

        if (!deletedMenu) {
          return res.status(404).json({ success: false, message: 'Menu not found' });
        }

        return res.status(200).json({ success: true, message: 'Menu deleted successfully' });
      } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
      }
    default:
      return res.status(400).json({ success: false });
  }
};

export default handlerDelete;
