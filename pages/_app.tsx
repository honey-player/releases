import Head from "next/head";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import "../styles/globals.css";

import type { AppProps } from "next/app";

dayjs.extend(relativeTime);

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>
					Download || Honey Player - The modern media player for
					friends
				</title>
				<meta
					name="description"
					content="Download the latest release of Honey Player"
				/>
			</Head>
			<Component {...pageProps} />
		</>
	);
}
