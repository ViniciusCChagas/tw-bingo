import { getDB } from '../../services/database';
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectID, ObjectId } from 'bson';

export default async (request: NextApiRequest, response: NextApiResponse) => {
	const db = await getDB(process.env.MONGODB_URI);
	const roomsCollection = db.collection('rooms');

	if (request.method === 'POST') {
		const data = request.body;

		const roomData = {
			roomName: data.roomName,
			roomType: data.roomType,
			maxFailures: data.maxFailures,
			maximumCards: data.maximumCards,
			showRaffledNumbers: data.showRaffledNumbers,
			showRanking: data.showRanking,
			notifyWinner: data.notifyWinner,
			owner: data.owner,
		};
		try {
			const { insertedId } = await roomsCollection.insertOne(roomData);
			return response.json({ roomId: insertedId });
		} catch (error) {
			return response.status(400).json({ error: 'Ops! Não foi possivel realizar o cadastro da sala.' });
		}
	} else if (request.method === 'GET') {
		const params = request.query as any;

		const id = new ObjectId(params.roomId);

		const roomData = await roomsCollection.findOne({ _id: id, owner: parseInt(params.currentUserId) });

		if (!roomData) {
			return response.status(404).json({ error: 'Sala não encontrada.' });
		}

		return response.json(roomData);
	}
};
