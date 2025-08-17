import { Link } from 'react-router-dom';
import HomePageCard from './HomePageCard';
import CORE_CONCEPTS from '../../data/data';
import '@styleLayouts/HomePageCards.scss';

function HomePageCards() {
  return (
    <section id='core-concepts'>
      <ul>
        {CORE_CONCEPTS.map(conceptItem => (
          <Link
            className='no-underline'
            to={conceptItem.link}
            key={conceptItem.title}
          >
            <HomePageCard key={conceptItem.title} {...conceptItem} />
          </Link>
        ))}
      </ul>
    </section>
  );
}

export default HomePageCards;
