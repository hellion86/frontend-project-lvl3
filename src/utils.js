import { uniqueId } from 'lodash';

export const makePosts = (data, idFeed) => {
	const posts = [];
	const lenNodeList = data.querySelectorAll('item').length;
	const items = data.querySelectorAll('item');
	for (let i = 0; i <= lenNodeList - 1; i += 1) {
		posts.push({
			id: i + 1,
			idFeed,
			title: items[i].querySelector('title').textContent,
			description: items[i].querySelector('description').textContent,
			link: items[i].querySelector('link').textContent,
		});
	}
	return posts;
};

export const makeFeeds = (data, url) => {
	const date = data.querySelector('pubDate') ? data.querySelector('pubDate').textContent : new Date();
	const feed = {
		id: uniqueId(),
		url,
		date,
		title: data.querySelector('title').textContent,
		description: data.querySelector('description').textContent,
	};
	return feed;
};
