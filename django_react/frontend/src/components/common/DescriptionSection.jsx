import React, { useState } from 'react';
import { Globe, Github } from 'lucide-react';

function DescriptionSection({ name, description, href }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-10 bg-white rounded-lg border border-gray-300">
      <div className="p-6 border-b">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
          About
          {' '}
          {name}
        </h2>
      </div>
      <div className="p-6">
        <p
          className={`text-gray-700 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <button
          type="button"
          onClick={toggleDescription}
          className="mt-2 text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
        <div className="mt-4 flex gap-4">
          {href && href.homepage[0] && (
            <a
              href={href.homepage[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Globe className="h-4 w-4" />
              Website
            </a>
          )}
          {href && href.repos_url.github[0] && (
            <a
              href={href.repos_url.github[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Github className="h-4 w-4" />
              Github
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default DescriptionSection;
