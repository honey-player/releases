import axios from "axios";
import dayjs from "dayjs";

import { LatestVersion } from "../types";
import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";

const Home: NextPage<Partial<LatestVersion>> = ({
	all_releases,
	release_notes,
	tag_name,
	author,
	published_at,
	releases,
}) => {
	const published = dayjs(published_at).fromNow();

	return (
		<div className="app">
			<Image
				src={"/icon.png"}
				width={300}
				height={300}
				alt="Icon"
				className="iconContainer"
			/>
			<div className="container">
				<>
					<div className="flex item-center justify-between">
						<h2>
							<a className="white" href="https://honeyplayer.com">
								honey-player/releases
							</a>
						</h2>
						<span className="text-gray">{published}</span>
					</div>
					<ul>
						{releases?.map((release) => {
							const s = parseFloat(
								release.size / 1024 / 1024 + ""
							);
							const size = s.toFixed(2);
							const url = release.browser_download_url;
							const isWin = ~url.indexOf(".msi");
							const isMac = ~url.indexOf(".dmg");
							const isLinux = ~url.indexOf(".AppImage");
							const isDeb = ~url.indexOf(".deb");

							if (
								!/\.msi$/.test(url) &&
								!/\.dmg$/.test(url) &&
								!/\.deb$/.test(url) &&
								!/\.AppImage$/.test(url)
							) {
								return null;
							}

							return (
								<li
									key={release.name}
									className="flex item-center justify-between"
									style={{ marginBottom: 15 }}
								>
									<div>
										<span
											style={{
												color: "white",
												paddingRight: 10,
											}}
										>
											{isWin ? "Windows" : ""}
											{isMac ? "MacOS" : ""}
											{isLinux ? "Linux" : ""}
											{isDeb ? "Debian" : ""}
										</span>
										<a href={release.browser_download_url}>
											{release.name}
										</a>
									</div>
									<span className="text-gray-2">
										{size} MB
									</span>
								</li>
							);
						})}
					</ul>
					<div className="flex item-center justify-between">
						<div className="flex item-center gap-2">
							<h4 className="version button-70">{tag_name}</h4>
							<a className="text-gray-3" href={release_notes}>
								Release Note
							</a>
						</div>
						<a className="text-gray-3" href={all_releases}>
							All Releases
						</a>
					</div>
				</>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async function ({ res }) {
	try {
		res.setHeader(
			"Cache-Control",
			"public, s-maxage=120, stale-while-revalidate=59"
		);

		const { data: latestVersion } = await axios(
			`${process.env.URL}/api/release/latest`
		);
		return { props: latestVersion };
	} catch (error) {
		return { props: {} };
	}
};

export default Home;
