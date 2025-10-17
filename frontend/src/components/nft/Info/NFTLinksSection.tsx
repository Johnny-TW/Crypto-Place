import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components/ui/tooltip';

interface LinkData {
  name: string;
  link: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface NFTLinksSectionProps {
  links: LinkData[];
}

const NFTLinksSection: React.FC<NFTLinksSectionProps> = ({ links }) => {
  return (
    <div className='flex items-center space-x-4 mt-4'>
      {links.map(linkData => (
        <TooltipProvider key={linkData.name}>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={linkData.link}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'
                aria-label={linkData.name}
              >
                <linkData.icon
                  className='h-5 w-5 text-gray-700'
                  aria-hidden='true'
                />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>{linkData.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default NFTLinksSection;
