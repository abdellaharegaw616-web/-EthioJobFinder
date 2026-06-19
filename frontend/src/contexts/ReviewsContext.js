import { createContext, useContext, useState, useEffect } from 'react';

const ReviewsContext = createContext();

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Load reviews from localStorage
    const savedReviews = localStorage.getItem('companyReviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  useEffect(() => {
    // Save reviews to localStorage whenever they change
    localStorage.setItem('companyReviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (reviewData) => {
    const newReview = {
      id: Date.now(),
      ...reviewData,
      createdAt: new Date().toISOString()
    };
    setReviews([...reviews, newReview]);
    return newReview;
  };

  const getCompanyReviews = (companyId) => {
    return reviews.filter(review => review.companyId === companyId);
  };

  const getCompanyRating = (companyId) => {
    const companyReviews = getCompanyReviews(companyId);
    if (companyReviews.length === 0) return 0;
    const sum = companyReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / companyReviews.length).toFixed(1);
  };

  const getReviewCount = (companyId) => {
    return getCompanyReviews(companyId).length;
  };

  const deleteReview = (reviewId) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
  };

  const value = {
    reviews,
    addReview,
    getCompanyReviews,
    getCompanyRating,
    getReviewCount,
    deleteReview
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
};
