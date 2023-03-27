import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs =>
        setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {    
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')    
    if (loggedUserJSON) {      
      const user = JSON.parse(loggedUserJSON)      
      setUser(user)      
      blogService.setToken(user.token)    
    }  
  }, [])

  const handleBlogChange = (event) => {
    setNewBlog(event.target.value)
  }

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const newObject = {
        title: newBlog,
        url: "awesomesauce.net",
        likes: 0,
      }

      blogService
        .create(newObject)
        .then(blog => {
          setBlogs(blogs.concat(blog))
          setNewBlog('')
          setSuccessMessage(`Added new blog: ${blog.title} by ${user.name}`)
          setTimeout(() => {        
            setSuccessMessage(null)   
          }, 5000)
        })
    }
    catch (exception) {
      setErrorMessage('Failed to post blog')      
      setTimeout(() => {        
        setErrorMessage(null)      
      }, 5000)
    }
  }

  const handleLogin = async (event) => {   
    event.preventDefault()        
    try {      
      const user = await loginService.login({        
        username, password,      
      })
      
      blogService.setToken(user.token)

      window.localStorage.setItem(        
        'loggedBlogappUser', JSON.stringify(user)      
      ) 

      setUser(user)      
      setUsername('')      
      setPassword('')

      setSuccessMessage(`Successfully logged into user: ${user.name}`)
      setTimeout(() => {        
        setSuccessMessage(null)   
      }, 5000)
    } catch (exception) {      
      setErrorMessage('Wrong credentials')      
      setTimeout(() => {        
        setErrorMessage(null)      
      }, 5000)    
    }  
  }

  const handleLogOut = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogappUser')
    setSuccessMessage('Successfully logged out')
    setTimeout(() => {        
      setSuccessMessage(null)   
    }, 5000)
  }

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
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <input
        value={newBlog}
        onChange={handleBlogChange}
      />
      <button type="submit">save</button>
    </form>  
  )
  
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      <Notification message={successMessage} />

      {!user && loginForm()}
      {user && 
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogOut}>log out</button>
          {blogForm()}
        </div>
      }

      <ul>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </ul>
    </div>
  )
}

export default App