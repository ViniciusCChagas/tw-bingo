import React, { useContext, useEffect, useState } from 'react';
import { CardContext } from '../contexts/CardContext';
import styles from '../styles/components/BingoCard.module.scss';
import { BingoCardBall } from './BingoCardBall';

interface BingoCardProps {
	ballCount: number;
}

export const BingoCard = function (props: BingoCardProps) {
	const { balls, handleBallClick } = useContext(CardContext);
	return (
		<div className={styles.container}>
			{balls.map((ball, index) => {
				return (
					<BingoCardBall
						key={index}
						number={ball.number}
						active={ball.active}
						onClick={() => {
							handleBallClick(ball.number);
						}}
					/>
				);
			})}
		</div>
	);
};
