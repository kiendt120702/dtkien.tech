import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    // Lấy blog từ localStorage
    const savedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    const foundBlog = savedBlogs.find(b => b.id === id);
    
    if (foundBlog) {
      setBlog(foundBlog);
    }
    
    setLoading(false);
  }, [id]);
  
  const handleDelete = () => {
    // Xóa blog từ localStorage
    const savedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    const updatedBlogs = savedBlogs.filter(b => b.id !== id);
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
    
    // Đóng modal và chuyển hướng
    setShowDeleteModal(false);
    navigate('/blog');
  };
  
  if (loading) {
    return (
      <div className="blog-detail-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Đang tải...</p>
      </div>
    );
  }
  
  if (!blog) {
    return (
      <div className="blog-not-found">
        <i className="fas fa-exclamation-triangle"></i>
        <h2>Không tìm thấy bài viết</h2>
        <p>Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link to="/blog" className="back-to-blog">
          <i className="fas fa-arrow-left"></i> Quay lại trang Blog
        </Link>
      </div>
    );
  }
  
  return (
    <div className="blog-detail">
      <div className="blog-controls">
        <Link to="/blog" className="back-button">
          <i className="fas fa-arrow-left"></i> Quay lại
        </Link>
        <div className="blog-actions">
          <Link to={`/blog/edit/${id}`} className="edit-button">
            <i className="fas fa-edit"></i> Chỉnh sửa
          </Link>
          <button className="delete-button" onClick={() => setShowDeleteModal(true)}>
            <i className="fas fa-trash-alt"></i> Xóa
          </button>
        </div>
      </div>
    
      <article className="blog-article">
        <h1 className="blog-title">{blog.title}</h1>
        
        <div className="blog-meta">
          <span className="blog-date">
            <i className="fas fa-calendar-alt"></i> Đăng ngày {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
          </span>
          {blog.category && (
            <span className="blog-category">
              <i className="fas fa-folder"></i> {blog.category}
            </span>
          )}
          {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
            <span className="blog-updated">
              <i className="fas fa-edit"></i> Cập nhật {new Date(blog.updatedAt).toLocaleDateString('vi-VN')}
            </span>
          )}
        </div>
        
        {blog.coverImage && (
          <div className="blog-cover">
            <img src={blog.coverImage} alt={blog.title} />
          </div>
        )}
        
        {blog.excerpt && (
          <div className="blog-excerpt">
            <p>{blog.excerpt}</p>
          </div>
        )}
        
        <div className="blog-content">
          {blog.content.split('\n').map((paragraph, index) => (
            paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
          ))}
        </div>
      </article>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc muốn xóa bài viết "{blog.title}" không?</p>
            <p className="warning">Hành động này không thể hoàn tác!</p>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setShowDeleteModal(false)}>
                Hủy
              </button>
              <button className="confirm-delete-button" onClick={handleDelete}>
                Xóa bài viết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;