import { Link } from 'react-router-dom';
import HomePageCard from './HomePageCard.jsx';
import { CORE_CONCEPTS } from '../../data/data.js';
import '../../styles/layouts/HomePageCards.scss';

function HomePageCards() {
  return (
    <>
      <div className="flex justify-center">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">The Main Function</h2>
      </div>
      <section id="core-concepts">
        <ul>
          {CORE_CONCEPTS.map((conceptItem) => (
            <Link className="no-underline" to={conceptItem.link} key={conceptItem.title}>
              <HomePageCard key={conceptItem.title} {...conceptItem} />
            </Link>
          ))}
        </ul>
      </section>
    </>
  );
}

export default HomePageCards;
