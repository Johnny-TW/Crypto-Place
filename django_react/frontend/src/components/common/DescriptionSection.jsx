import React from 'react';
import { Globe, Github } from 'lucide-react';

function DescriptionSection({ name, description, href }) {
  return (
    <div className="mb-10 bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">
          About
          {' '}
          {name}
        </h2>
      </div>
      <div className="p-6">
        <p
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: description }}
        />
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
