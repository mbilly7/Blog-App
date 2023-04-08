import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [blogFormVisible, setBlogFormVisible] = useState(false);

  useEffect(() => {
    blogService
      .getAll()
      .then((returnedBlogs) => setBlogs(returnedBlogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      setUser(loggedUser);
      blogService.setToken(loggedUser.token);
    }
  }, []);

  const handleBlogChange = (event) => {
    setNewBlog(event.target.value);
  };

  const addBlog = async (event) => {
    event.preventDefault();

    try {
      const newObject = {
        title: newBlog,
        url: 'awesomesauce.net',
        likes: 0,
        author: user.name,
      };

      blogService
        .create(newObject)
        .then((blog) => {
          setBlogs(blogs.concat(blog));
          setNewBlog('');
          setSuccessMessage(`Added new blog: ${blog.title} by ${user.name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        });

      setBlogFormVisible(false);
    } catch (exception) {
      setErrorMessage('Failed to post blog');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userToLogin = await loginService.login({
        username, password,
      });

      blogService.setToken(userToLogin.token);

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(userToLogin));

      setUser(userToLogin);
      setUsername('');
      setPassword('');

      setSuccessMessage(`Successfully logged into user: ${userToLogin.name}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogOut = () => {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem('loggedBlogappUser');
    setSuccessMessage('Successfully logged out');
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    };

    blogService
      .update(blog.id, updatedBlog)
      .then((returnedBlog) => {
        setBlogs(blogs
          .map((currBlog) => (currBlog.id === blog.id ? returnedBlog : currBlog))
          .sort((a, b) => b.likes - a.likes));
      });
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Are you sure you want to delete ${blog.title}?`)) {
      blogService
        .remove(blog.id)
        .then(() => {
          setBlogs(blogs
            .filter((currBlog) => currBlog.id !== blog.id));
        });
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' };
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' };

    return (
      <div>
        <div style={hideWhenVisible}>
          <button type="button" onClick={() => setBlogFormVisible(true)}>new blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm
            newBlog={newBlog}
            addBlog={addBlog}
            handleBlogChange={handleBlogChange}
            visible={blogFormVisible}
            setVisible={setBlogFormVisible}
          />
          <button type="button" onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      <Notification message={successMessage} />

      {!user && loginForm()}
      {user
        && (
        <div>
          <p>
            {user.name}
            {' '}
            logged in
          </p>
          <button type="button" onClick={handleLogOut}>log out</button>
          {blogForm()}
        </div>
        )}

      <ul>
        {blogs.map((blog) => (
          <div key={blog.id}>
            <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} />
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;
