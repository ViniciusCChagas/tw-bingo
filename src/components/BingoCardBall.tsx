import styles from '../styles/components/BingoCardBall.module.scss';

interface BingoCardBallProps {
	number: number;
	active: boolean;
	onClick: () => void;
}

export const BingoCardBall = function (props: BingoCardBallProps) {
	return (
		<div className={`${styles.ballContainer} ${props.active ? styles.active : null}`} onClick={props.onClick}>
			<span>{props.number}</span>
		</div>
	);
};
