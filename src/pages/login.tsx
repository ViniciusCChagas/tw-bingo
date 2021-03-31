import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import Head from 'next/head';
import styles from '../styles/pages/Login.module.scss';

import { signIn } from 'next-auth/client';
import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
	const [isLoading, setIsLoading] = useState(false);

	async function handleLogin() {
		setIsLoading(true);
		await signIn('twitch', { callbackUrl: 'http://localhost:3000/' });
	}

	return (
		<>
			<Head>
				<title>Login | TWBingo</title>
			</Head>
			<div className={styles.container}>
				<div className={styles.formContainer}>
					<img src='./assets/logo.png' alt='Logo TWBingo' />
					<button onClick={handleLogin}>
						{isLoading ? (
							<FontAwesomeIcon icon={faSpinner} spin={true} className={styles.loadingIcon} />
						) : (
							<>
								<FontAwesomeIcon icon={faTwitch} className={styles.twitchIcon} />
								<p>Entrar com a Twitch</p>
							</>
						)}
					</button>
				</div>

				<div className={styles.headerDiv}></div>
				<div className='patternContainer'></div>
			</div>
		</>
	);
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	return {
		props: {},
	};
}
