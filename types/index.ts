export type TRelease = {
	browser_download_url: string;
	size: number;
	download_count: number;
	name: string;
};

export type LatestVersion = {
	all_releases: string;
	release_notes: string;
	tag_name: string;
	author: string;
	published_at: string;
	releases: TRelease[];
};
