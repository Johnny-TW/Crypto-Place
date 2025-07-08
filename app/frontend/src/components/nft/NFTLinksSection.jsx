function NFTLinksSection({ links }) {
  function LinkItem({ name, link, icon: Icon }) {
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
        <a className='inline' href={link} aria-label={name}>
          {link}
        </a>
      </div>
    );
  }

  return (
    <dl className='mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none'>
      {links.map(link => (
        <LinkItem
          key={link.name}
          name={link.name}
          link={link.link}
          icon={link.icon}
        />
      ))}
    </dl>
  );
}

export default NFTLinksSection;
