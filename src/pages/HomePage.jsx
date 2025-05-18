import FolderCard from '../components/FolderCard';
import { 
  faStar, 
  faBoxOpen, 
  faUsers, 
  faShoppingCart, 
  faBullhorn 
} from '@fortawesome/free-solid-svg-icons';
import './HomePage.css';

const HomePage = () => {
  // Danh sách các thư mục
  const folders = [
    {
      icon: faStar,
      title: 'Tính điểm đánh giá trung bình',
      description: 'Nhập số lượng đánh giá theo từng mức sao và tính toán điểm trung bình của sản phẩm.',
      path: '/averageShopee',
      bgColor: '#fce4ec',
      iconColor: '#f471a5'
    },
    {
      icon: faBoxOpen,
      title: 'Quản lý sản phẩm',
      description: 'Theo dõi hiệu suất sản phẩm, phân tích xu hướng bán hàng và quản lý kho hàng.',
      path: '/products',
      bgColor: '#e3f2fd',
      iconColor: '#2196f3'
    },
    {
      icon: faUsers,
      title: 'Phân tích khách hàng',
      description: 'Xem thông tin về khách hàng, hành vi mua sắm và phân khúc khách hàng theo khu vực.',
      path: '/customers',
      bgColor: '#e8f5e9',
      iconColor: '#4caf50'
    },
    {
      icon: faShoppingCart,
      title: 'Quản lý đơn hàng',
      description: 'Theo dõi đơn hàng, xử lý hoàn tiền và quản lý trạng thái vận chuyển.',
      path: '/orders',
      bgColor: '#fff8e1',
      iconColor: '#ffc107'
    },
    {
      icon: faBullhorn,
      title: 'Chiến dịch Marketing',
      description: 'Tạo và quản lý chiến dịch marketing, theo dõi hiệu suất và điều chỉnh chiến lược.',
      path: '/marketing',
      bgColor: '#ffebee',
      iconColor: '#f44336'
    }
  ];

  return (
    <section className="dashboard-section">
      <div className="container">
        
        <div className="folder-grid">
          {folders.map((folder, index) => (
            <FolderCard
              key={index}
              icon={folder.icon}
              title={folder.title}
              description={folder.description}
              path={folder.path}
              bgColor={folder.bgColor}
              iconColor={folder.iconColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePage;