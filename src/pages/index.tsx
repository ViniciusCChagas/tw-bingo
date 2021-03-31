import Head from 'next/head';
import styles from '../styles/pages/Index.module.scss';

import * as yup from 'yup';

import { getSession, Session, useSession } from 'next-auth/client';
import { GetServerSidePropsContext } from 'next';
import { DragSwitch } from 'react-dragswitch';
import 'react-dragswitch/dist/index.css';
import { useState } from 'react';
import axios from 'axios';
import { ValidationError } from 'yup';
import { useRouter } from 'next/router';

interface HomeProps {
	session: Session;
}

export default function Home({ session }: HomeProps) {
	const history = useRouter();

	const [formErrors, setFormErrors] = useState([]);

	const [roomName, setRoomName] = useState('');
	const [roomType, setRoomType] = useState('COMPLETA');
	const [maxFailures, setMaxFailures] = useState(3);
	const [maximumCards, setMaximumCars] = useState(1000);
	const [showRaffledNumbers, setShowRaffledNumbers] = useState(false);
	const [showRanking, setShowRanking] = useState(true);
	const [notifyWinner, setNotifyWinner] = useState(false);

	async function handleSubmit(event: React.FormEvent) {
		event.preventDefault();

		const maxFailuresErrorMessage = 'Infome o número maximo de falhas do jogador! (Min.: 1 Falha)';
		const maximumCardsErrorMessage = 'Infome o número maximo de falhas do jogador! (Min.: 1 Falha)';

		const roomSchema = yup.object().shape({
			roomName: yup.string().required('Informe um Nome para a sua sala!'),
			roomType: yup.string().required('Informe um Tipo para a sua sala!'),
			maxFailures: yup
				.number()
				.min(1, 'O número mínimo para este campo é 1 falha')
				.typeError(maxFailuresErrorMessage)
				.required(maxFailuresErrorMessage),
			maximumCards: yup
				.number()
				.min(1, 'O número mínimo para este campo é 1 Cartela')
				.typeError(maximumCardsErrorMessage)
				.required(maximumCardsErrorMessage),
			showRaffledNumbers: yup.boolean(),
			showRanking: yup.boolean(),
			notifyWinner: yup.boolean(),
		});

		const formData = {
			roomName,
			roomType,
			maxFailures,
			maximumCards,
			showRaffledNumbers,
			showRanking,
			notifyWinner,
			owner: session.twitchId,
		};

		await roomSchema
			.validate(formData, { abortEarly: false })
			.then(async (isValid) => {
				setFormErrors([]);
				console.log(isValid);
				if (isValid) {
					await axios
						.post('/api/rooms', formData)
						.then((response) => {
							history.push(`/room/admin/${response.data.roomId}`);
						})
						.catch((error) => {
							alert('Ops, tivemos um problema para criar a sua sala! Tente novamente mais tarde!');
						});
				}
			})
			.catch((err) => {
				const errors = [];
				err.inner.forEach((key) => {
					errors[key.path] = key.message;
				});
				console.log(err.inner);
				setFormErrors(errors);
				console.log(errors);
			});
	}

	return (
		<>
			<Head>
				<title>Inicio | TWBingo</title>
			</Head>
			<div className={styles.container}>
				<img src='./assets/logo.png' alt='TW Bingo' />
				<div className={styles.formContainer}>
					<form onSubmit={handleSubmit}>
						<label>Nome da sala:</label>
						<input
							placeholder='Digite um nome para a sua sala'
							type='text'
							value={roomName}
							onChange={(e) => {
								setRoomName(e.currentTarget.value);
							}}
							className={formErrors['roomName'] ? styles.inputError : null}
						/>
						{formErrors['roomName'] ? (
							<p className={styles.inputErrorMessage}>{formErrors['roomName']}</p>
						) : null}

						<label>Tipo de jogo:</label>
						<select
							value={roomType}
							onChange={(e) => {
								setRoomType(e.currentTarget.value);
							}}
							className={formErrors['roomType'] ? styles.inputError : null}
						>
							<option value='COMPLETA'>Cartela completa</option>
							<option value='HORIZONTAL'>Linha horizontal</option>
							<option value='VERTICAL'>Linha vertical</option>
							<option value='CRUZ'>Cruz</option>
						</select>
						{formErrors['roomType'] ? (
							<p className={styles.inputErrorMessage}>{formErrors['roomType']}</p>
						) : null}

						<div className={styles.inputGroup}>
							<div className={styles.groupItem}>
								<label>Máximo de falhas:</label>
								<input
									type='number'
									value={maxFailures}
									onChange={(e) => {
										setMaxFailures(parseInt(e.currentTarget.value));
									}}
									className={formErrors['maxFailures'] ? styles.inputError : null}
								></input>
								{formErrors['maxFailures'] ? (
									<p className={styles.inputErrorMessage}>{formErrors['maxFailures']}</p>
								) : null}
							</div>
							<div>
								<label>Qtde. de Cartelas</label>
								<input
									type='number'
									value={maximumCards}
									onChange={(e) => {
										setMaximumCars(parseInt(e.currentTarget.value));
									}}
									className={formErrors['maximumCards'] ? styles.inputError : null}
								></input>
								{formErrors['maximumCards'] ? (
									<p className={styles.inputErrorMessage}>{formErrors['maximumCards']}</p>
								) : null}
							</div>
						</div>
						<div className={styles.checkboxGroup}>
							<label>Mostrar número já sorteados</label>
							<DragSwitch
								onColor='#3ea2ff'
								checked={showRaffledNumbers}
								onChange={(c) => {
									setShowRaffledNumbers(c);
								}}
							></DragSwitch>
						</div>

						<div className={styles.checkboxGroup}>
							<label>Mostrar número já sorteados</label>
							<DragSwitch
								onColor='#3ea2ff'
								checked={showRanking}
								onChange={(c) => {
									setShowRanking(c);
								}}
							></DragSwitch>
						</div>

						<div className={styles.checkboxGroup}>
							<label>Notificar ganhador</label>
							<DragSwitch
								onColor='#3ea2ff'
								checked={notifyWinner}
								onChange={(c) => {
									setNotifyWinner(c);
								}}
							></DragSwitch>
						</div>

						<button type='submit'>Criar sala</button>
					</form>
				</div>

				<div className='patternContainer'></div>
			</div>
		</>
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
