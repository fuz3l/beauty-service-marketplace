import React from 'react';
import { MapPin, Star, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ArtistCard = React.memo(({ 
  id, 
  name, 
  location, 
  avatar, 
  rating, 
  reviewCount, 
  startingPrice, 
  speciality,
  isVerified
}) => {
  const navigate = useNavigate();
  const formatPrice = (p) => p ? `₹${p.toLocaleString('en-IN')}` : 'Contact for price';

  const specialtiesList = speciality ? speciality.split(',').slice(0, 2).join(', ') : 'Makeup Artist';

  return (
    <div 
      onClick={() => navigate(`/artist/${id}`)}
      className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full group"
    >
      <div className="p-5 flex flex-col items-center flex-1">
        <div className="relative mb-4">
          {avatar ? (
            <img 
              src={avatar} 
              alt={name} 
              className="w-20 h-20 rounded-full object-cover border-4 border-rose-50"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-2xl font-bold border-4 border-rose-50">
              {name ? name[0].toUpperCase() : 'A'}
            </div>
          )}
          {isVerified && (
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
              <BadgeCheck className="w-5 h-5 text-blue-500" />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1 mb-1">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-bold text-neutral-700">{rating > 0 ? rating : 'New'}</span>
          {reviewCount > 0 && <span className="text-neutral-400 text-sm">({reviewCount})</span>}
        </div>

        <h3 className="text-lg font-bold text-neutral-900 text-center mb-1 line-clamp-1">{name}</h3>
        
        <div className="flex items-center text-neutral-500 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 mr-1" />
          <span className="line-clamp-1">{location || 'Remote'}</span>
        </div>

        <div className="mt-auto flex flex-col items-center w-full">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 mb-4 text-center line-clamp-1">
            {specialtiesList}
          </span>
          <div className="text-sm text-neutral-500 mb-1">Starting from</div>
          <div className="text-rose-600 font-bold text-lg mb-4">{formatPrice(startingPrice)}</div>
          <button className="w-full py-2.5 px-4 border border-rose-200 text-rose-600 rounded-xl font-medium group-hover:bg-rose-50 transition-colors">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
});

export default ArtistCard;
