// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { octokit } from "../../../lib/git";
import { LatestVersion } from "../../../types";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<LatestVersion>
	// res: NextApiResponse<any>
) {
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
		res.status(204).json({
			all_releases: "",
			release_notes: "",
			tag_name: "",
			author: "",
			published_at: "",
			releases: [],
		});
		return;
	}

	const { tag_name, author, published_at, assets, html_url } = latestRelease;
	const releases = assets.map(
		({ browser_download_url, size, download_count, name }) => ({
			browser_download_url,
			size,
			download_count,
			name,
		})
	);

	res.status(200).json({
		all_releases: html_url.replace(/tag.+$/, ""),
		release_notes: html_url,
		tag_name,
		author: author.login,
		published_at: published_at || "",
		releases,
	});
}
