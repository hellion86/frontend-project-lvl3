import { uniqueId } from 'lodash';

export const makePosts = (data, idFeed) => {
	const items = data.querySelectorAll('item');
	const posts = Array.from(items).map((item) => (
		{
			id: uniqueId(),
			idFeed,
			title: item.querySelector('title').textContent,
			description: item.querySelector('description').textContent,
			link: item.querySelector('link').textContent,
		}
	));
	return posts;
};

export const makeFeeds = (data, url, num) => {
	const date = data.querySelector('pubDate') ? data.querySelector('pubDate').textContent : new Date();
	const feed = {
		id: num + 1,
		url,
		date,
		title: data.querySelector('title').textContent,
		description: data.querySelector('description').textContent,
	};
	return feed;
};
