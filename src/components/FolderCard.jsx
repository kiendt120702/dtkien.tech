import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './FolderCard.css';

const FolderCard = ({ icon, title, description, path, bgColor, iconColor }) => {
  return (
    <div className="folder-card">
      <Link to={path}>
        <div 
          className="folder-image" 
          style={{ backgroundColor: bgColor || 'var(--light-pink)' }}
        >
          <FontAwesomeIcon 
            icon={icon} 
            className="folder-icon" 
            style={{ color: iconColor || 'var(--pink)' }}
          />
        </div>
        <div className="folder-content">
          <h3 className="folder-title">{title}</h3>
          <p className="folder-description">{description}</p>
          <span className="folder-link">
            Mở thư mục <FontAwesomeIcon icon={faArrowRight} />
          </span>
        </div>
      </Link>
    </div>
  );
};

export default FolderCard;