import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../hooks/useData';

const Occasion: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading } = useData();

  useEffect(() => {
    if (!loading && data) {
      const occasion = data.occasions.find(occ => occ.slug === slug);
      if (occasion) {
        window.location.href = occasion.redirectLink;
      }
    }
  }, [slug, data, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default Occasion;