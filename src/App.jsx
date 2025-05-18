import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AverageShopee from './pages/AverageShopee';
import BlogPage from './pages/BlogPage';
import BlogEditor from './pages/BlogEditor';
import BlogDetail from './pages/BlogDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/averageShopee" element={<AverageShopee />} />
            
            {/* Blog Routes */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/new" element={<BlogEditor />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/blog/edit/:id" element={<BlogEditor />} />
            
            <Route path="/products" element={<div className="container" style={{padding: '50px 0'}}>
              <h2>Quản Lý Sản Phẩm</h2>
              <p>Trang này đang được phát triển...</p>
            </div>} />
            <Route path="/customers" element={<div className="container" style={{padding: '50px 0'}}>
              <h2>Phân Tích Khách Hàng</h2>
              <p>Trang này đang được phát triển...</p>
            </div>} />
            <Route path="/orders" element={<div className="container" style={{padding: '50px 0'}}>
              <h2>Quản Lý Đơn Hàng</h2>
              <p>Trang này đang được phát triển...</p>
            </div>} />
            <Route path="/marketing" element={<div className="container" style={{padding: '50px 0'}}>
              <h2>Chiến Dịch Marketing</h2>
              <p>Trang này đang được phát triển...</p>
            </div>} />
            <Route path="/about" element={<div className="container" style={{padding: '50px 0'}}>
              <h2>Giới Thiệu</h2>
              <p>Trang này đang được phát triển...</p>
            </div>} />
            <Route path="/contact" element={<div className="container" style={{padding: '50px 0'}}>
              <h2>Liên Hệ</h2>
              <p>Trang này đang được phát triển...</p>
            </div>} />
            <Route path="*" element={<div className="container" style={{padding: '50px 0', textAlign: 'center'}}>
              <h2>404 - Không Tìm Thấy Trang</h2>
              <p>Trang bạn đang tìm kiếm không tồn tại.</p>
            </div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;