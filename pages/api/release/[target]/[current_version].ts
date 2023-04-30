// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

import { octokit } from "../../../../lib/git";

type PlatformDetail = {
	url: string;
	version: string;
	notes: string;
	pub_date: string;
	signature: string;
};

type Platform = {
	windows: Partial<PlatformDetail>;
	macos: Partial<PlatformDetail>;
	linux: Partial<PlatformDetail>;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<unknown>
	// res: NextApiResponse<Version>
) {
	try {
		const params = req.query;
		const isWindowPlatform = params.target === "windows";
		const isMacOSPlatform = params.target === "macos";
		const isLinuxPlatform = params.target === "linux";

		const { data } = await octokit.request(
			"GET /repos/{owner}/{repo}/releases",
			{
				owner: "honey-player",
				repo: "releases",
			}
		);

		const latestRelease = data.find(
			(release) =>
				release.prerelease === false &&
				release.draft === false &&
				release.assets.length > 2
		);

		if (!latestRelease) {
			res.status(204).send("No Content");
			return;
		}

		const { tag_name, published_at, assets } = latestRelease;
		const platforms: Platform = { windows: {}, macos: {}, linux: {} };

		for (const item of assets) {
			const { browser_download_url, size, download_count, name } = item;
			if (/msi\.zip$/.test(browser_download_url) && isWindowPlatform) {
				platforms.windows = {
					url: browser_download_url,
					version: tag_name,
					notes: "",
					pub_date: published_at || "",
					signature: "",
				};
				continue;
			}

			if (
				/msi\.zip\.sig$/.test(browser_download_url) &&
				isWindowPlatform
			) {
				const { data: signature } = await axios(browser_download_url);
				platforms.windows = {
					...platforms.windows,
					...{
						signature,
					},
				};
				continue;
			}

			if (
				/AppImage\.tar\.gz$/.test(browser_download_url) &&
				isMacOSPlatform
			) {
				platforms.macos = {
					url: browser_download_url,
					version: tag_name,
					notes: "",
					pub_date: published_at || "",
					signature: "",
				};
				continue;
			}

			if (
				/AppImage\.tar\.gz\.sig$/.test(browser_download_url) &&
				isMacOSPlatform
			) {
				const { data: signature } = await axios(browser_download_url);
				platforms.macos = {
					...platforms.macos,
					...{
						signature,
					},
				};
				continue;
			}

			if (/app\.tar\.gz$/.test(browser_download_url) && isLinuxPlatform) {
				platforms.linux = {
					url: browser_download_url,
					version: tag_name,
					notes: "",
					pub_date: published_at || "",
					signature: "",
				};
				continue;
			}

			if (
				/app\.tar\.gz\.sig$/.test(browser_download_url) &&
				isLinuxPlatform
			) {
				const { data: signature } = await axios(browser_download_url);
				platforms.linux = {
					...platforms.linux,
					...{
						signature,
					},
				};
				continue;
			}
		}

		if (isWindowPlatform) {
			// s-maxage=120:                data is fresh in 120s
			// stale-while-revalidate=59:   after 1 - 60 data is stale
			//                              during that time, new revalidation request will be made
			// res.setHeader(
			//   "Cache-control",
			//   "public, s-maxage=120, stale-while-revalidate=59"
			// );
			res.status(200).json(platforms.windows);
			return;
		}

		if (isMacOSPlatform) {
			// res.setHeader(
			//   "Cache-control",
			//   "public, s-maxage=120, stale-while-revalidate=59"
			// );
			res.status(200).json(platforms.macos);
			return;
		}

		if (isLinuxPlatform) {
			// res.setHeader(
			//   "Cache-control",
			//   "public, s-maxage=120, stale-while-revalidate=59"
			// );
			res.status(200).json(platforms.linux);
			return;
		}

		res.status(204).send("No Content");
	} catch (error) {
		res.status(500).send(error);
	}
}
