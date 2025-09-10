import React from 'react';
import '../../styles/layouts/HomePageCard.scss';

interface HomePageCardProps {
  image: string;
  title: string;
  description: string;
}

const HomePageCard: React.FC<HomePageCardProps> = ({
  image,
  title,
  description,
}) => {
  return (
    <li className='imageCard'>
      <img className='mx-auto mb-4' src={image} alt={title} />
      <h3 className='font-bold text-xl mb-2 text-center'>{title}</h3>
      <p className='text-gray-700 text-center'>{description}</p>
    </li>
  );
};

export default HomePageCard;
