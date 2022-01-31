import { uniqueId } from 'lodash';

export const makePosts = (data, feedId) => {
	const posts = [];
	data.querySelectorAll('item').forEach((post) => {
		posts.push({
			id: uniqueId(),
			idFeed: feedId,
			title: post.querySelector('title').textContent,
			description: post.querySelector('description').textContent,
			link: post.querySelector('link').textContent,
			});
		});
	return posts;
};

export const makeFeeds = (data) => {
	const feed = {
		id: uniqueId(),
		title: data.querySelector('title').textContent,
		description: data.querySelector('description').textContent,
	};
	return feed;
};
