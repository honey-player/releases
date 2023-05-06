// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

import semver from "semver";

import { octokit } from "../../../../../lib/git";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<unknown>
	// res: NextApiResponse<Version>
) {
	try {
		const params = req.query;

		const { data: latestRelease } =
			await octokit.rest.repos.getLatestRelease({
				owner: "honey-player",
				repo: "releases",
			});

		if (!latestRelease) {
			res.status(204).send("No Content");
			return;
		}

		const latestVersion = latestRelease.tag_name
			.toLowerCase()
			.split("v")
			.pop();
		if (!latestVersion || !semver.valid(latestVersion)) {
			res.status(204).send("No Content");
			return;
		}

		const currentVersion =
			`${params.current_version}`.toLowerCase().split("v").pop() ?? "";

		const shouldUpdate = semver.gt(latestVersion, currentVersion);
		if (!shouldUpdate) {
			res.status(204).send("No Content");
			return;
		}

		const updater = latestRelease.assets.find((asset) =>
			/.json$/.test(asset.browser_download_url)
		);
		if (!updater) {
			res.status(204).send("No Content");
			return;
		}

		const { data: updaterJson } = await axios(updater.browser_download_url);

		const target = params.target ?? "";
		const arch = params.arch ?? "";
		const platformName = `${target}-${arch}`;

		const filteredPlatforms = updaterJson.platforms[platformName]
			? { [platformName]: updaterJson.platforms[platformName] }
			: updaterJson.platforms;

		res.status(200).json({
			...updaterJson,
			notes: latestRelease.body ?? "",
			platforms: filteredPlatforms,
		});
	} catch (error) {
		res.status(500).send(error);
	}
}
