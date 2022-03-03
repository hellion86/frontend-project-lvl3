export default (loadData) => {
  const parser = new DOMParser();
  const dataFromUrl = parser.parseFromString(loadData.data.contents, 'text/xml');
  const errorsOnPage = dataFromUrl.querySelector('parsererror');
  if (errorsOnPage) {
    throw new Error('badRss.xmlParseEntityRef');
  } else {
    const feed = {
      title: dataFromUrl.querySelector('title').textContent,
      description: dataFromUrl.querySelector('description').textContent,
    };
    const postsData = dataFromUrl.querySelectorAll('item');
    const posts = Array.from(postsData).map((item) => (
      {
        title: item.querySelector('title').textContent,
        description: item.querySelector('description').textContent,
        link: item.querySelector('link').textContent,
      }
    ));
    return [feed, posts];
  }
};
