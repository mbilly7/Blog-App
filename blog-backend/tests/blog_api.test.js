const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const helper = require('../utils/test_helper');
const User = require('../models/user');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', passwordHash });

  await user.save();
});

describe('for GET requests, verify that', () => {
  test('correct number of blogs are returned from GET request', async () => {
    const userObject = {
      username: 'root',
      password: 'sekret',
    };

    const loginResponse = await api.post('/api/login').send(userObject).expect(200);
    const response = await api.get('/api/blogs').set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(await response.body.length).toEqual(await helper.numBlogsInDb());
  }, 100000);

  test('id field exists in GET response body', async () => {
    const userObject = {
      username: 'root',
      password: 'sekret',
    };

    const loginResponse = await api.post('/api/login').send(userObject).expect(200);
    const response = await api.get('/api/blogs').set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(response.body[0].id).toBeDefined();
  }, 100000);
});

describe('for POST requests, verify that', () => {
  test('likes property is zero if not given', async () => {
    const userObject = {
      username: 'root',
      password: 'sekret',
    };

    const loginResponse = await api.post('/api/login').send(userObject).expect(200);

    const newBlog = {
      title: 'cool blog',
      author: 'cool guy',
      url: 'coolbeans.com',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsInDb = await helper.blogsInDb();
    const numBlogsInDb = await helper.numBlogsInDb();

    expect(blogsInDb[numBlogsInDb - 1].likes).toEqual(0);
  }, 100000);

  test('bad request response if title/url are missing', async () => {
    const userObject = {
      username: 'root',
      password: 'sekret',
    };

    const loginResponse = await api.post('/api/login').send(userObject).expect(200);

    const newBlog = {
      author: 'cool guy',
      likes: 2,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  }, 100000);
});

describe('for DELETE requests, verify that', () => {
  test('a blog post is correctly deleted', async () => {
    const userObject = {
      username: 'root',
      password: 'sekret',
    };

    const loginResponse = await api.post('/api/login').send(userObject).expect(200);
    const newBlog = {
      title: 'cool blog',
      author: 'cool guy',
      url: 'coolbeans.com',
    };

    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const idToDelete = postResponse.body.id;

    await api.delete(`/api/blogs/${idToDelete}`).set('Authorization', `Bearer ${loginResponse.body.token}`);
    const deletedBlog = await Blog.findById(idToDelete);

    expect(deletedBlog).toEqual(null);
  });

  test('a 400 response is given if invalid id', async () => {
    const idToDelete = -1;
    await api.delete(`/api/blogs/${idToDelete}`).expect(400);
  });
});

describe('for PUT requests, verify that', () => {
  test('a blog post is correctly updated', async () => {
    const userObject = {
      username: 'root',
      password: 'sekret',
    };

    const loginResponse = await api.post('/api/login').send(userObject).expect(200);
    const newBlog = {
      title: 'cool blog',
      author: 'cool guy',
      url: 'coolbeans.com',
      likes: 3,
    };

    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const updatedBlog = {
      ...newBlog,
      likes: newBlog.likes + 1,
    };

    await api
      .put(`/api/blogs/${postResponse.body.id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(updatedBlog)
      .expect(200);

    const updatedBlogToVerify = await Blog.findById(postResponse.body.id);

    expect(updatedBlogToVerify.likes).toEqual(updatedBlog.likes);
  });

  test('a 400 response is given if invalid id', async () => {
    const idToDelete = -1;
    await api.put(`/api/blogs/${idToDelete}`).expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
