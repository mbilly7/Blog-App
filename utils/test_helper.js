const Blog = require('../models/blog');
const User = require('../models/user');

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const numBlogsInDb = async () => {
  const blogs = await Blog.find({});
  console.log(blogs.length);
  return blogs.length;
}

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  nonExistingId,
  blogsInDb,
  usersInDb,
  numBlogsInDb,
};
