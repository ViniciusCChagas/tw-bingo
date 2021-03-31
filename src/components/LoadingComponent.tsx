import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../styles/components/LoadingComponent.module.scss';

export const LoadingComponent = function () {
	return (
		<div className={styles.loadingContainer}>
			<FontAwesomeIcon icon={faSpinner} spin={true} />
			<h1>Carregando sala...</h1>
			<div className='patternContainer'></div>
		</div>
	);
};
