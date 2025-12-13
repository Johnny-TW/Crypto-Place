import React from 'react';
import {
  BsFacebook,
  BsReddit,
  BsTelegram,
  BsTwitter,
  BsGlobe,
  BsMedium,
  BsSlack,
} from 'react-icons/bs';
import { SiSteemit } from 'react-icons/si';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface ExchangeSocialLinksProps {
  url?: string;
  facebook_url?: string;
  reddit_url?: string;
  telegram_url?: string;
  twitter_handle?: string;
  slack_url?: string;
  other_url_1?: string;
  other_url_2?: string;
  compact?: boolean;
}

function ExchangeSocialLinks({
  url,
  facebook_url,
  reddit_url,
  telegram_url,
  twitter_handle,
  slack_url,
  other_url_1,
  other_url_2,
  compact = false,
}: ExchangeSocialLinksProps) {
  const socialLinks: SocialLink[] = [
    {
      name: 'Website',
      url: url || '',
      icon: BsGlobe,
      color: '#4A5568',
      bgColor: 'bg-gray-100',
    },
    {
      name: 'Twitter',
      url: twitter_handle ? `https://twitter.com/${twitter_handle}` : '',
      icon: BsTwitter,
      color: '#1DA1F2',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Facebook',
      url: facebook_url || '',
      icon: BsFacebook,
      color: '#1877F2',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Reddit',
      url: reddit_url || '',
      icon: BsReddit,
      color: '#FF4500',
      bgColor: 'bg-orange-50',
    },
    {
      name: 'Telegram',
      url: telegram_url || '',
      icon: BsTelegram,
      color: '#0088CC',
      bgColor: 'bg-sky-50',
    },
    {
      name: 'Slack',
      url: slack_url || '',
      icon: BsSlack,
      color: '#4A154B',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Medium',
      url: other_url_1 || '',
      icon: BsMedium,
      color: '#000000',
      bgColor: 'bg-gray-50',
    },
    {
      name: 'Steemit',
      url: other_url_2 || '',
      icon: SiSteemit,
      color: '#4BA2F2',
      bgColor: 'bg-blue-50',
    },
  ].filter(link => link.url && link.url !== '' && link.url !== '#');

  if (socialLinks.length === 0) {
    return (
      <div className='text-sm text-gray-500 italic'>
        No social links available
      </div>
    );
  }

  const content = (
    <div
      className={`grid gap-3 ${compact ? 'grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'}`}
    >
      {socialLinks.map(link => (
        <a
          key={link.name}
          href={link.url}
          target='_blank'
          rel='noopener noreferrer'
          className='group block'
        >
          <div
            className={`
            flex flex-col items-center justify-center p-2 rounded-xl border border-gray-100 
            transition-all duration-200 hover:border-gray-300 hover:shadow-sm hover:-translate-y-0.5
            ${compact ? 'aspect-square' : 'h-full py-4'}
            bg-white
          `}
          >
            <div
              className={`
              flex items-center justify-center rounded-full transition-colors
              ${compact ? 'w-8 h-8 mb-1' : 'w-10 h-10 mb-2'}
              ${link.bgColor}
            `}
            >
              <link.icon
                size={compact ? 16 : 20}
                style={{ color: link.color }}
              />
            </div>
            {!compact && (
              <span className='text-xs font-medium text-gray-700 text-center'>
                {link.name}
              </span>
            )}
          </div>
        </a>
      ))}
    </div>
  );

  if (compact) {
    return content;
  }

  return (
    <Card className='shadow-sm border-gray-200'>
      <CardHeader>
        <CardTitle className='text-lg font-bold text-gray-900'>
          Official Links & Community
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content}

        <div className='mt-6 pt-4 border-t border-gray-100 flex items-center gap-2'>
          <span className='text-sm font-medium text-gray-500'>Connected:</span>
          <Badge
            variant='secondary'
            className='bg-blue-50 text-blue-700 hover:bg-blue-100'
          >
            {socialLinks.length} Platforms
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default ExchangeSocialLinks;
