import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Blog({ blog, handleLike, handleDelete }) {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const [showDetails, setShowDetails] = useState(false);

  return (
    <div>
      <div style={blogStyle}>
        <div>{blog.title}</div>
        {showDetails && <div>{blog.author}</div>}
        {showDetails
        && (
        <div>
          {blog.likes}
          {' '}
          <button type="button" onClick={() => handleLike(blog)}>like</button>
        </div>
        )}
        {showDetails && <div>{blog.url}</div>}
        {showDetails && <button type="button" onClick={() => handleDelete(blog)}>delete</button>}
      </div>
      {!showDetails && <button type="button" onClick={() => setShowDetails(true)}>view</button>}
      {showDetails && <button type="button" onClick={() => setShowDetails(false)}>hide</button>}
    </div>
  );
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Blog;
