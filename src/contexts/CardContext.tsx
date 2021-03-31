import { createContext, useEffect, useState } from 'react';

interface CardContextData {
	handleBallClick: (ballNumber: number) => void;
	setBallActive: (ballNumber: number) => void;
	balls: Array<Ball>;
}

interface Ball {
	number: number;
	active: boolean;
}

export const CardContext = createContext({} as CardContextData);

export function CardProvider({ children }) {
	const [balls, setBalls] = useState([]);

	function handleBallClick(ballNumber: number) {
		const newBalls = balls.map((ballItem) => {
			if (ballItem.number === ballNumber) {
				return { ...ballItem, active: !ballItem.active };
			}
			return ballItem;
		});

		setBalls(newBalls);
	}

	function setBallActive(ballNumber: number) {
		const newBalls = balls.map((ballItem) => {
			if (ballItem.number === ballNumber) {
				return { ...ballItem, active: true };
			}
			return ballItem;
		});

		setBalls(newBalls);
	}

	useEffect(() => {
		let newBalls = [];
		for (let i = 1; i <= 90; i++) {
			newBalls.push({ number: i, active: false });
		}
		setBalls(newBalls);
	}, []);

	useEffect(() => {
		console.log('Atulizou as bolas sorteadas');
	}, [balls]);

	return <CardContext.Provider value={{ handleBallClick, setBallActive, balls }}>{children}</CardContext.Provider>;
}
