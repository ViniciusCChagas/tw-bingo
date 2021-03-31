import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<Head>
						<link rel='preconnect' href='https://fonts.gstatic.com' />
						<link rel='shortcut icon' href='favicon.png' type='image/png' />
						<link
							href='https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap'
							rel='stylesheet'
						></link>
					</Head>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
