import React from 'react';
import { Link } from 'react-router-dom';
import HomePageCard from './HomePageCard';
import CORE_CONCEPTS from '../../data/data';
import '@styleLayouts/HomePageCards.scss';

interface ConceptItem {
  image: string;
  title: string;
  link: string;
  description: string;
}

function HomePageCards(): JSX.Element {
  return (
    <section id='core-concepts'>
      <ul>
        {CORE_CONCEPTS.map((conceptItem: ConceptItem) => (
          <Link
            className='no-underline'
            to={conceptItem.link}
            key={conceptItem.title}
          >
            <HomePageCard
              key={conceptItem.title}
              image={conceptItem.image}
              title={conceptItem.title}
              description={conceptItem.description}
            />
          </Link>
        ))}
      </ul>
    </section>
  );
}

export default HomePageCards;
