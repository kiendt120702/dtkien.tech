import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Bạn cần cài đặt uuid: npm install uuid
import './BlogEditor.css';

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    coverImage: '',
  });
  
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Load blog if editing
  useEffect(() => {
    if (isEditing) {
      const savedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
      const blogToEdit = savedBlogs.find(b => b.id === id);
      
      if (blogToEdit) {
        setBlog(blogToEdit);
      } else {
        // Blog không tồn tại, chuyển hướng về trang blog
        navigate('/blog');
      }
    }
  }, [id, isEditing, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlog(prev => ({
          ...prev,
          coverImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = () => {
    if (!blog.title.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    
    if (!blog.content.trim()) {
      alert('Vui lòng nhập nội dung bài viết');
      return;
    }
    
    setSaving(true);
    
    // Lấy blogs từ localStorage
    const savedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    
    let updatedBlogs;
    
    if (isEditing) {
      // Cập nhật blog hiện tại
      updatedBlogs = savedBlogs.map(b => 
        b.id === id ? { ...blog, updatedAt: new Date().toISOString() } : b
      );
    } else {
      // Tạo blog mới
      const newBlog = {
        ...blog,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updatedBlogs = [...savedBlogs, newBlog];
    }
    
    // Lưu vào localStorage
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
    
    // Delay nhỏ để hiển thị trạng thái lưu
    setTimeout(() => {
      setSaving(false);
      navigate('/blog');
    }, 800);
  };
  
  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };
  
  return (
    <div className="blog-editor">
      <div className="editor-header">
        <h1>{isEditing ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}</h1>
        <div className="editor-actions">
          <button 
            className={`preview-button ${previewMode ? 'active' : ''}`} 
            onClick={togglePreview}
          >
            <i className="fas fa-eye"></i> {previewMode ? 'Chỉnh sửa' : 'Xem trước'}
          </button>
          <button 
            className="save-button" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Đang lưu...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i> Lưu bài viết
              </>
            )}
          </button>
        </div>
      </div>
      
      {!previewMode ? (
        <div className="editor-form">
          <div className="form-group">
            <label htmlFor="title">Tiêu đề</label>
            <input
              type="text"
              id="title"
              name="title"
              value={blog.title}
              onChange={handleChange}
              placeholder="Nhập tiêu đề bài viết"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Danh mục</label>
              <input
                type="text"
                id="category"
                name="category"
                value={blog.category}
                onChange={handleChange}
                placeholder="Ví dụ: Công nghệ, Kinh doanh, ..."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="coverImage">Ảnh bìa</label>
              <input
                type="file"
                id="coverImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
              {blog.coverImage && (
                <div className="image-preview">
                  <img src={blog.coverImage} alt="Preview" />
                  <button 
                    className="remove-image" 
                    onClick={() => setBlog(prev => ({ ...prev, coverImage: '' }))}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="excerpt">Tóm tắt (tùy chọn)</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={blog.excerpt}
              onChange={handleChange}
              placeholder="Nhập tóm tắt ngắn cho bài viết"
              rows="2"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Nội dung</label>
            <textarea
              id="content"
              name="content"
              value={blog.content}
              onChange={handleChange}
              placeholder="Nhập nội dung bài viết của bạn ở đây..."
              rows="12"
              required
            ></textarea>
          </div>
        </div>
      ) : (
        <div className="blog-preview">
          <h1 className="preview-title">{blog.title || 'Tiêu đề bài viết'}</h1>
          
          {blog.coverImage && (
            <div className="preview-cover">
              <img src={blog.coverImage} alt={blog.title} />
            </div>
          )}
          
          {blog.category && (
            <div className="preview-category">
              <span><i className="fas fa-folder"></i> {blog.category}</span>
            </div>
          )}
          
          {blog.excerpt && (
            <div className="preview-excerpt">
              <p>{blog.excerpt}</p>
            </div>
          )}
          
          <div className="preview-content">
            {blog.content.split('\n').map((paragraph, index) => (
              paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogEditor;