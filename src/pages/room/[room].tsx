import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { getSession, Session } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface AdminPageProps {
	session: Session;
}

export default function AdminPage({ session }) {
	const router = useRouter();

	const { room } = router.query;

	return <h1>Sala de player ID: {room}</h1>;
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
