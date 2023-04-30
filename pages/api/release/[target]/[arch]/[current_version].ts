// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

import { octokit } from "../../../../../lib/git";

type Platform = {
	url: string;
	signature: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<unknown>
	// res: NextApiResponse<Version>
) {
	try {
		const params = req.query;
		const isWindowPlatform = params.target === "windows";
		const isMacOSPlatform = params.target === "darwin";
		const isLinuxPlatform = params.target === "linux";

		if (!isWindowPlatform && !isMacOSPlatform && !isLinuxPlatform) {
			res.status(204).send("No Content");
			return;
		}

		const { data } = await octokit.request(
			"GET /repos/{owner}/{repo}/releases",
			{
				owner: "honey-player",
				repo: "releases",
				page: 1,
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

		const windowsPlatform: Platform = { signature: "", url: "" };
		const macPlatform: Platform = { signature: "", url: "" };
		const linuxPlatform: Platform = { signature: "", url: "" };

		const assets = latestRelease.assets ?? [];
		for (const item of assets) {
			const { browser_download_url } = item;

			if (/msi\.zip$/.test(browser_download_url) && isWindowPlatform) {
				windowsPlatform.url = browser_download_url;
				continue;
			}
			if (
				/msi\.zip\.sig$/.test(browser_download_url) &&
				isWindowPlatform
			) {
				const { data: signature } = await axios(browser_download_url);
				windowsPlatform.signature = signature;
				continue;
			}

			if (
				/AppImage\.tar\.gz$/.test(browser_download_url) &&
				isMacOSPlatform
			) {
				macPlatform.url = browser_download_url;
				continue;
			}
			if (
				/AppImage\.tar\.gz\.sig$/.test(browser_download_url) &&
				isMacOSPlatform
			) {
				const { data: signature } = await axios(browser_download_url);
				macPlatform.signature = signature;
				continue;
			}

			if (/app\.tar\.gz$/.test(browser_download_url) && isLinuxPlatform) {
				linuxPlatform.url = browser_download_url;
				continue;
			}

			if (
				/app\.tar\.gz\.sig$/.test(browser_download_url) &&
				isLinuxPlatform
			) {
				const { data: signature } = await axios(browser_download_url);
				linuxPlatform.signature = signature;
				continue;
			}
		}

		const updater = {
			version: latestRelease.tag_name ?? "",
			notes: latestRelease.body ?? "",
			pub_date: latestRelease.published_at ?? "",
		};
		const platformName = `${params.target}-${params.arch}`;

		if (isWindowPlatform) {
			res.status(200).json({
				...updater,
				platforms: { [platformName]: windowsPlatform },
			});
			return;
		}

		if (isMacOSPlatform) {
			res.status(200).json({
				...updater,
				platforms: { [platformName]: macPlatform },
			});
			return;
		}

		if (isLinuxPlatform) {
			res.status(200).json({
				...updater,
				platforms: { [platformName]: linuxPlatform },
			});
			return;
		}

		res.status(204).send("No Content");
	} catch (error) {
		res.status(500).send(error);
	}
}
