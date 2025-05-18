import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BlogPage.css';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  
  // Load blogs from localStorage on component mount
  useEffect(() => {
    const savedBlogs = localStorage.getItem('blogs');
    if (savedBlogs) {
      setBlogs(JSON.parse(savedBlogs));
    }
  }, []);

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Bài viết Blog</h1>
        <Link to="/blog/new" className="new-blog-button">
          <i className="fas fa-plus"></i> Viết bài mới
        </Link>
      </div>
      
      {blogs.length === 0 ? (
        <div className="empty-blogs">
          <i className="fas fa-newspaper empty-icon"></i>
          <h2>Chưa có bài viết nào</h2>
          <p>Hãy bắt đầu viết bài đầu tiên của bạn.</p>
          <Link to="/blog/new" className="start-writing-button">
            Bắt đầu viết
          </Link>
        </div>
      ) : (
        <div className="blog-list">
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              {blog.coverImage && (
                <div className="blog-cover-image">
                  <img src={blog.coverImage} alt={blog.title} />
                </div>
              )}
              <div className="blog-content">
                <h2 className="blog-title">
                  <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                </h2>
                <div className="blog-meta">
                  <span className="blog-date">
                    <i className="fas fa-calendar-alt"></i> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                  {blog.category && (
                    <span className="blog-category">
                      <i className="fas fa-folder"></i> {blog.category}
                    </span>
                  )}
                </div>
                <p className="blog-excerpt">{blog.excerpt || blog.content.substring(0, 150)}...</p>
                <Link to={`/blog/${blog.id}`} className="read-more">
                  Đọc tiếp <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;