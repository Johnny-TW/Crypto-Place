import React from 'react';

interface LinkData {
  name: string;
  link: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface NFTLinksSectionProps {
  links: LinkData[];
}

interface LinkItemProps {
  name: string;
  link: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const NFTLinksSection: React.FC<NFTLinksSectionProps> = ({ links }) => {
  const LinkItem: React.FC<LinkItemProps> = ({ name, link, icon: Icon }) => {
    return (
      <div className='relative pl-9'>
        <dt className='inline font-semibold text-gray-900'>
          <Icon
            aria-hidden='true'
            className='absolute left-1 top-1 h-5 w-5 text-indigo-600'
          />
          {name}
        </dt>
        <br />
        <a
          className='inline'
          href={link}
          aria-label={name}
          target='_blank'
          rel='noopener noreferrer'
        >
          {link}
        </a>
      </div>
    );
  };

  return (
    <dl className='mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none'>
      {links.map(linkData => (
        <LinkItem
          key={linkData.name}
          name={linkData.name}
          link={linkData.link}
          icon={linkData.icon}
        />
      ))}
    </dl>
  );
};

export default NFTLinksSection;
