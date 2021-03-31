import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { getSession, Session, session } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BingoCard } from '../../../components/BingoCard';
import { LoadingComponent } from '../../../components/LoadingComponent';
import { CardProvider } from '../../../contexts/CardContext';

import styles from '../../../styles/pages/RoomAdmin.module.scss';

export default function AdminPage({ session }: Session) {
	const router = useRouter();
	const { room } = router.query;

	const [isSessionValid, setIsSessionValid] = useState(false);
	const [roomData, setRoomData] = useState({});

	useEffect(() => {
		console.log(session);
		try {
			const response = axios.get('/api/rooms', {
				params: {
					roomId: room,
					currentUserId: session.twitchId,
				},
			});
			setRoomData(response);
			setIsSessionValid(true);
		} catch (error) {
			router.push('/');
		}
	}, []);
	return (
		<div>
			{isSessionValid ? (
				<div className={styles.container}>
					<div className={styles.adminContainer}>
						<div className={styles.cardContainer}>
							<CardProvider>
								<BingoCard ballCount={90} />
							</CardProvider>
						</div>
						<div className={styles.buttonsContainer}></div>
					</div>

					<div className='patternContainer'></div>
				</div>
			) : (
				<LoadingComponent />
			)}
		</div>
	);
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const session = await getSession(ctx);

	if (!session) {
		ctx.res.writeHead(303, { Location: 'login' });
		ctx.res.end();
	}

	return {
		props: {
			session,
		},
	};
}
