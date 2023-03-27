const _ = require('lodash');

const totalLikes = (blogs) => {
  const likes = blogs.reduce((currentSum, blog) => currentSum + blog.likes, 0);

  return likes;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return -1;
  }

  let currentFavorite = blogs[0];

  blogs.forEach((blog) => {
    if (blog.likes > currentFavorite.likes) {
      currentFavorite = blog;
    }
  });

  return currentFavorite;
};

const mostBlogs = (blogs) => {
  const mostBlogsResult = {
    author: 'null',
    blogs: -1,
  };

  if (blogs.length === 0) {
    return mostBlogsResult;
  }

  const authorBlogs = _.countBy(blogs, 'author');

  // eslint-disable-next-line no-restricted-syntax
  for (const [author, numberOfBlogs] of Object.entries(authorBlogs)) {
    if (numberOfBlogs > mostBlogsResult.blogs) {
      mostBlogsResult.author = author;
      mostBlogsResult.blogs = numberOfBlogs;
    }
  }

  return mostBlogsResult;
};

const mostLikes = (blogs) => {
  const mostLikesResult = {
    author: 'null',
    likes: -1,
  };

  if (blogs.length === 0) {
    return mostLikesResult;
  }

  const authorLikes = _.groupBy(blogs, 'author');

  // eslint-disable-next-line no-restricted-syntax
  for (const [author, listOfBlogs] of Object.entries(authorLikes)) {
    let likes = 0;

    listOfBlogs.forEach((blog) => {
      likes += blog.likes;
    });

    if (likes > mostLikesResult.likes) {
      mostLikesResult.author = author;
      mostLikesResult.likes = likes;
    }
  }

  return mostLikesResult;
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
