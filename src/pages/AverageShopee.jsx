import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar as fasStar, 
  faSliders, 
  faCalculator, 
  faChartBar, 
  faChartPie, 
  faExclamationCircle, 
  faTimes,
  faArrowUp,
  faAngleUp
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import './AverageShopee.css';

const AverageShopee = () => {
  // States
  const [showResults, setShowResults] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [ratings, setRatings] = useState({
    star5: 0,
    star4: 0,
    star3: 0,
    star2: 0,
    star1: 0
  });
  const [results, setResults] = useState({
    totalReviews: 0,
    averageRating: 0,
    percentages: {
      percent5: 0,
      percent4: 0,
      percent3: 0,
      percent2: 0,
      percent1: 0
    }
  });
  const [targetRating, setTargetRating] = useState('');
  const [neededRatings, setNeededRatings] = useState(null);

  // Refs
  const resultSectionRef = useRef(null);
  const inputRefs = {
    star5: useRef(null),
    star4: useRef(null),
    star3: useRef(null),
    star2: useRef(null),
    star1: useRef(null),
    targetRating: useRef(null)
  };

  // Use effect to focus on first input when component mounts
  useEffect(() => {
    if (inputRefs.star5.current) {
      inputRefs.star5.current.focus();
    }
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setRatings(prev => ({
      ...prev,
      [id]: value === '' ? 0 : parseInt(value)
    }));
  };

  // Handle target rating change
  const handleTargetRatingChange = (e) => {
    const value = e.target.value;
    
    // Allow any input that could potentially form a valid floating point number
    // This regex allows:
    // - digits (0-9)
    // - a single decimal point
    // - prevents more than one decimal point
    if (value === '' || /^[0-9]+\.?[0-9]*$/.test(value)) {
      // Only update state if the value is <= 5
      if (value === '' || parseFloat(value) <= 5) {
        setTargetRating(value);
      }
    }
  };

  // Handle keydown - make Enter work like Tab
  const handleKeyDown = (e, currentInput) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputs = ['star5', 'star4', 'star3', 'star2', 'star1'];
      const currentIndex = inputs.indexOf(currentInput);
      
      if (currentIndex < inputs.length - 1) {
        inputRefs[inputs[currentIndex + 1]].current.focus();
      } else {
        calculateRating();
      }
    }
  };

  // Show toast message
  const showToast = (message) => {
    setToast({ show: true, message });
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  // Calculate how many 5-star ratings are needed to achieve target rating
  const calculateNeededRatings = () => {
    if (!targetRating || parseFloat(targetRating) <= results.averageRating) {
      setNeededRatings(null);
      return;
    }

    // Current values
    const { star5, star4, star3, star2, star1 } = ratings;
    const currentTotalReviews = star5 + star4 + star3 + star2 + star1;
    const currentTotalPoints = (star5 * 5) + (star4 * 4) + (star3 * 3) + (star2 * 2) + (star1 * 1);

    // Target calculation
    const targetRatingValue = parseFloat(targetRating);
    
    // Special case for target of exactly 5.0
    if (targetRatingValue >= 4.95) {
      // If we want to display 5.0 (which is often shown rounded up from 4.95+)
      // Calculate how many 5-star ratings are needed to reach 4.95
      const needed = Math.ceil(
        (4.95 * currentTotalReviews - currentTotalPoints) / (5 - 4.95)
      );
      
      setNeededRatings(needed > 0 ? needed : null);
      return;
    }
    
    // Let x be the number of 5-star reviews we need to add
    // (currentTotalPoints + 5x) / (currentTotalReviews + x) = targetRatingValue
    // currentTotalPoints + 5x = targetRatingValue * (currentTotalReviews + x)
    // currentTotalPoints + 5x = targetRatingValue * currentTotalReviews + targetRatingValue * x
    // 5x - targetRatingValue * x = targetRatingValue * currentTotalReviews - currentTotalPoints
    // x(5 - targetRatingValue) = targetRatingValue * currentTotalReviews - currentTotalPoints
    // x = (targetRatingValue * currentTotalReviews - currentTotalPoints) / (5 - targetRatingValue)

    const needed = Math.ceil(
      (targetRatingValue * currentTotalReviews - currentTotalPoints) / (5 - targetRatingValue)
    );

    setNeededRatings(needed > 0 ? needed : null);
  };

  // Calculate rating function
  const calculateRating = () => {
    const { star5, star4, star3, star2, star1 } = ratings;
    
    // Calculate total reviews
    const totalReviews = star5 + star4 + star3 + star2 + star1;
    
    if (totalReviews === 0) {
      showToast('Vui lòng nhập ít nhất một đánh giá!');
      return;
    }
    
    // Calculate average rating
    const totalPoints = (star5 * 5) + (star4 * 4) + (star3 * 3) + (star2 * 2) + (star1 * 1);
    const averageRating = (totalPoints / totalReviews).toFixed(1);
    
    // Calculate percentages
    const percent5 = Math.round((star5 / totalReviews) * 100);
    const percent4 = Math.round((star4 / totalReviews) * 100);
    const percent3 = Math.round((star3 / totalReviews) * 100);
    const percent2 = Math.round((star2 / totalReviews) * 100);
    const percent1 = Math.round((star1 / totalReviews) * 100);
    
    // Update results
    setResults({
      totalReviews,
      averageRating: parseFloat(averageRating),
      percentages: {
        percent5,
        percent4,
        percent3,
        percent2,
        percent1
      }
    });
    
    // Show results
    setShowResults(true);
    
    // If there's a target rating, calculate needed ratings
    if (targetRating) {
      calculateNeededRatings();
    }
    
    // Scroll to results after a short delay to allow state update
    setTimeout(() => {
      if (resultSectionRef.current) {
        resultSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  return (
    <div className="container">
      <div className="card">
        {/* Header */}
        <div className="title-container">
          <h1 className="center-title">Tính Điểm Đánh Giá Trung Bình</h1>
        </div>
        
        {/* Main content */}
        <div className="content">
          <div className="flex-container">
            {/* Left column: Form input */}
            <div className="column">
              <h2>
                <FontAwesomeIcon icon={faSliders} className="icon-heading" /> Nhập số lượng đánh giá
              </h2>
              <div className="rating-inputs">
                {/* 5 stars */}
                <div className="rating-card">
                  <div className="rating-info">
                    <div className="stars">
                      <FontAwesomeIcon icon={fasStar} />
                      <FontAwesomeIcon icon={fasStar} />
                      <FontAwesomeIcon icon={fasStar} />
                      <FontAwesomeIcon icon={fasStar} />
                      <FontAwesomeIcon icon={fasStar} />
                    </div>
                  </div>
                  <div className="input-container">
                    <input 
                      type="number" 
                      id="star5"
                      ref={inputRefs.star5}
                      min="0" 
                      placeholder="0"
                      value={ratings.star5 || ''}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, 'star5')}
                    />
                  </div>
                </div>
                
                {/* 4 stars */}
                <div className="rating-card">
                  <div className="rating-info">
                    <div className="stars">
                      <FontAwesomeIcon icon={fasStar} />
                      <FontAwesomeIcon icon={fasStar} />
                      <FontAwesomeIcon icon={fasStar} />
                      <FontAwesomeIcon icon={fasStar} />
                      <FontAwesomeIcon icon={farStar} className="empty" />
                    </div>
                  </div>
                  <div className="input-container">
                    <input 
                      type="number" 
                      id="star4"
                      ref={inputRefs.star4}
                      min="0" 
                      placeholder="0"
                      value={ratings.star4 || ''}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, 'star4')}
                    />
                  </div>
                </div>
                
                {/* 3 stars */}
                <div className="rating-card">
                  <div className="rating-info">
                    <div className="stars">
                      <FontAwesomeIcon icon={fasStar} />
                      <FontAwesomeIcon icon={fasStar} />
                      <FontAwesomeIcon icon={fasStar} />
                      <FontAwesomeIcon icon={farStar} className="empty" />
                      <FontAwesomeIcon icon={farStar} className="empty" />
                    </div>
                  </div>
                  <div className="input-container">
                    <input 
                      type="number" 
                      id="star3"
                      ref={inputRefs.star3}
                      min="0" 
                      placeholder="0"
                      value={ratings.star3 || ''}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, 'star3')}
                    />
                  </div>
                </div>
                
                {/* 2 stars */}
                <div className="rating-card">
                  <div className="rating-info">
                    <div className="stars">
                      <FontAwesomeIcon icon={fasStar} />
                      <FontAwesomeIcon icon={fasStar} />
                      <FontAwesomeIcon icon={farStar} className="empty" />
                      <FontAwesomeIcon icon={farStar} className="empty" />
                      <FontAwesomeIcon icon={farStar} className="empty" />
                    </div>
                  </div>
                  <div className="input-container">
                    <input 
                      type="number" 
                      id="star2"
                      ref={inputRefs.star2}
                      min="0" 
                      placeholder="0"
                      value={ratings.star2 || ''}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, 'star2')}
                    />
                  </div>
                </div>
                
                {/* 1 star */}
                <div className="rating-card">
                  <div className="rating-info">
                    <div className="stars">
                      <FontAwesomeIcon icon={fasStar} />
                      <FontAwesomeIcon icon={farStar} className="empty" />
                      <FontAwesomeIcon icon={farStar} className="empty" />
                      <FontAwesomeIcon icon={farStar} className="empty" />
                      <FontAwesomeIcon icon={farStar} className="empty" />
                    </div>
                  </div>
                  <div className="input-container">
                    <input 
                      type="number" 
                      id="star1"
                      ref={inputRefs.star1}
                      min="0" 
                      placeholder="0"
                      value={ratings.star1 || ''}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, 'star1')}
                    />
                  </div>
                </div>

                {/* Target Rating Input */}
                <div className="rating-card target-rating-card">
                  <div className="rating-info">
                    <div className="target-label">
                      <FontAwesomeIcon icon={faAngleUp} className="target-icon" />
                      <span>Mục tiêu</span>
                    </div>
                  </div>
                  <div className="input-container">
                    <input 
                      type="number" 
                      id="targetRating"
                      ref={inputRefs.targetRating}
                      placeholder="4.7"
                      value={targetRating}
                      onChange={handleTargetRatingChange}
                      step="0.1"
                      min="0"
                      max="5"
                    />
                  </div>
                </div>
              </div>
              
              {/* Calculate button */}
              <div className="button-container">
                <button 
                  className="pulse-button"
                  onClick={calculateRating}
                >
                  <FontAwesomeIcon icon={faCalculator} /> Tính điểm trung bình
                </button>
              </div>
            </div>
            
            {/* Right column: Result section */}
            <div className="column">
              <div ref={resultSectionRef} className={`result-section ${!showResults ? 'hidden' : ''}`}>
                <h2>
                  <FontAwesomeIcon icon={faChartBar} className="icon-heading" /> Kết quả đánh giá
                </h2>
                
                {/* Results card */}
                <div className="result-card-modern">
                  <div className="result-content-modern">
                    {/* Left column: Total reviews */}
                    <div className="result-block-modern">
                      <div className="result-icon-modern blue-bg">
                        <FontAwesomeIcon icon={faChartBar} />
                      </div>
                      <div className="result-label-modern">Tổng số đánh giá</div>
                      <div className="result-value-modern" id="totalReviews">
                        <AnimatedCounter 
                          end={results.totalReviews} 
                          duration={1000} 
                        />
                      </div>
                      <div className="result-divider-modern"></div>
                    </div>
                    
                    {/* Right column: Average Rating */}
                    <div className="result-block-modern">
                      <div className="result-icon-modern purple-bg">
                        <FontAwesomeIcon icon={fasStar} />
                      </div>
                      <div className="result-label-modern">Điểm trung bình</div>
                      <div className="result-value-modern" id="averageRating">
                        <AnimatedCounter 
                          end={results.averageRating} 
                          duration={1000} 
                          decimal={true}
                        />
                      </div>
                      <div className="result-divider-modern"></div>
                    </div>
                  </div>
                </div>

                {neededRatings && (
                  <div className="target-rating-info">
                    <div className="needed-ratings-card">
                      <div className="needed-ratings-icon">
                        <FontAwesomeIcon icon={faArrowUp} />
                      </div>
                      <div className="needed-ratings-text">
                        Cần <span className="highlight">{isFinite(neededRatings) ? neededRatings : "nhiều"}</span> đánh giá 5 sao để lên <span className="highlight">{parseFloat(targetRating) >= 4.95 ? "5" : targetRating}</span> sao
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Rating distribution */}
                <div className="rating-distribution">
                  <h3>Phân bố đánh giá</h3>
                  <div className="rating-bars">
                    {/* 5 stars bar */}
                    <RatingBar 
                      stars={5} 
                      percentage={results.percentages.percent5} 
                    />
                    
                    {/* 4 stars bar */}
                    <RatingBar 
                      stars={4} 
                      percentage={results.percentages.percent4} 
                    />
                    
                    {/* 3 stars bar */}
                    <RatingBar 
                      stars={3} 
                      percentage={results.percentages.percent3} 
                    />
                    
                    {/* 2 stars bar */}
                    <RatingBar 
                      stars={2} 
                      percentage={results.percentages.percent2} 
                    />
                    
                    {/* 1 star bar */}
                    <RatingBar 
                      stars={1} 
                      percentage={results.percentages.percent1} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Empty state for results */}
              {!showResults && (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FontAwesomeIcon icon={faChartPie} />
                  </div>
                  <h3>Chưa có kết quả</h3>
                  <p>
                    Nhập số lượng đánh giá theo từng mức sao và nhấn nút "Tính điểm trung bình" để xem kết quả
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>
        <div className="toast-icon">
          <FontAwesomeIcon icon={faExclamationCircle} />
        </div>
        <span>{toast.message}</span>
        <button 
          className="toast-close"
          onClick={() => setToast({ ...toast, show: false })}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ end, duration, decimal = false }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    let animationFrameId;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = progress * end;
      
      if (decimal) {
        setCount(parseFloat(currentCount.toFixed(1)));
      } else {
        setCount(Math.floor(currentCount));
      }
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration, decimal]);
  
  return <>{count}</>;
};

// Rating Bar Component
const RatingBar = ({ stars, percentage }) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    // Delay to create animation effect
    const timeout = setTimeout(() => {
      setWidth(percentage);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [percentage]);
  
  return (
    <div className="rating-bar-row">
      <div className="rating-label">
        <FontAwesomeIcon icon={fasStar} />
        <span>{stars}</span>
      </div>
      <div className="rating-bar-container">
        <div 
          className="rating-bar-fill" 
          style={{ width: `${width}%` }}
        ></div>
      </div>
      <div className="rating-percent">{percentage}%</div>
    </div>
  );
};

export default AverageShopee;