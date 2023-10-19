import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Card, { CardDocumentType } from '@/models/Card';

export default async function getAllCards(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const cards: CardDocumentType[] = await Card.find();

    const data = cards.map((card: CardDocumentType) => {
      const { _id, items, status, title, content } = card;
      return { id: _id, items, status, title, content };
    });

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
