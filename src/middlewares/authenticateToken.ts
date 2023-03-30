import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
}

export interface MyNextApiRequest extends NextApiRequest {
  userId?: string | (() => string);
}

const authenticateToken =
  (handler: (req: MyNextApiRequest, res: NextApiResponse) => Promise<void>) =>
  async (req: MyNextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method === 'OPTIONS') {
      res.status(200).end();

      return;
    }

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Not authenticated' });

      return;
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

      req.userId = decodedToken.userId;

      await handler(req, res);
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Not authenticated' });
    }
  };

export default authenticateToken;
