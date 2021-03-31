import { Db, MongoClient } from 'mongodb';

let cachedDb: Db = null;

export const getDB = async (uri: string) => {
	if (cachedDb) {
		return cachedDb;
	}

	try {
		const client = await MongoClient.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		const db = client.db(process.env.MONGODB_DB_NAME);
		cachedDb = db;

		return db;
	} catch (error) {
		console.error(error);
		return null;
	}
};
