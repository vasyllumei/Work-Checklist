import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User, { UserDocumentType } from '@/models/User';
import authenticateToken from '@/middlewares/authenticateToken';

async function getAllUsers(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    console.log(req.query, 'req.query');

    // Pagination
    const limit = parseInt(req.query.limit as string, 10) || 5;
    const skip = parseInt(req.query.skip as string, 10) || 0;
    console.log(limit, 'limit');

    console.log(skip, 'skip');
    // Filtering
    const filter: any = {};
    if (req.query.filter) {
      const filterQuery = req.query.filter as string;
      const filterParts = filterQuery.split('&');
      filterParts.forEach(part => {
        const [name, value] = part.split('=');
        if (!filter[name]) {
          filter[name] = [];
        }
        filter[name].push(value);
      });
    }
    // Sorting
    const sort: any = {};
    if (req.query.sort) {
      console.log('SortBy:', req.query.sort);
      console.log('Order:', req.query.order);
      sort[req.query.sort as string] = req.query.order === 'desc' ? -1 : 1;
    }
    // Search
    const searchQuery = req.query.search;
    const searchFilter = searchQuery
      ? {
          $or: [
            { firstName: { $regex: searchQuery, $options: 'i' } },
            { lastName: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } },
          ],
        }
      : {};

    const users: UserDocumentType[] = await User.find(
      {
        ...filter,
        ...searchFilter,
      },
      '-password -__v',
    )
      .sort(sort)
      .skip(skip)
      .limit(limit);
    const data = users.map((user: UserDocumentType) => {
      const { _id, firstName, lastName, email, role, iconColor } = user;
      return { id: _id, firstName, lastName, email, role, iconColor };
    });
    const totalUsers = await User.countDocuments({ ...filter, ...searchFilter });

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      data: data,
      totalPages,
      totalUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default authenticateToken(getAllUsers);
