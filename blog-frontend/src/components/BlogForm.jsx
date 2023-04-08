import React from 'react';
import PropTypes from 'prop-types';

function BlogForm({
  newBlog,
  addBlog,
  handleBlogChange,
}) {
  return (
    <form onSubmit={addBlog}>
      <input
        value={newBlog}
        onChange={handleBlogChange}
      />
      <button type="submit">save</button>
    </form>
  );
}

BlogForm.propTypes = {
  newBlog: PropTypes.string.isRequired,
  addBlog: PropTypes.func.isRequired,
  handleBlogChange: PropTypes.func.isRequired,
};

export default BlogForm;
