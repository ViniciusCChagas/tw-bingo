import { getDB } from '../../../services/database';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { type } from 'node:os';

type TwitchUser = {
	name: string;
	email: string;
	picture: string;
	sub: string;
	iat: number;
	exp: number;
};

export default NextAuth({
	providers: [
		Providers.Twitch({
			clientId: process.env.TWITCH_CLIENT_ID,
			clientSecret: process.env.TWITCH_SECRET,
		}),
	],
	callbacks: {
		async signIn(user, account, profile) {
			const data = profile.data[0];
			const userData = {
				twitchId: parseInt(data.id),
				name: data.display_name,
				email: data.email,
				avatar: data.profile_image_url,
			};

			try {
				const db = await getDB(process.env.MONGODB_URI);
				const usersCollection = db.collection('users');

				let newUser = await usersCollection.findOne({ twitchId: userData.twitchId });
				if (!newUser) {
					const { insertedId } = await usersCollection.insertOne(userData);
					// newUser = await usersCollection.findOne({ twitchId: userData.twitchId });
				}
				return true;
			} catch (error) {
				console.error(error);
				return false;
			}
		},
		async session(session, token: TwitchUser) {
			const newSession = {
				...session,
				twitchId: parseInt(token.sub),
			};
			return newSession;
		},
	},
	database: process.env.MONGODB_URL,
	debug: false,
});
