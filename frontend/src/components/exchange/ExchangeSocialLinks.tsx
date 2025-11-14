import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
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
}: ExchangeSocialLinksProps) {
  const socialLinks: SocialLink[] = [
    {
      name: 'Website',
      url: url || '',
      icon: BsGlobe,
      color: '#4A5568',
      bgColor: '#EDF2F7',
    },
    {
      name: 'Twitter',
      url: twitter_handle ? `https://twitter.com/${twitter_handle}` : '',
      icon: BsTwitter,
      color: '#1DA1F2',
      bgColor: '#E8F5FE',
    },
    {
      name: 'Facebook',
      url: facebook_url || '',
      icon: BsFacebook,
      color: '#1877F2',
      bgColor: '#E7F3FF',
    },
    {
      name: 'Reddit',
      url: reddit_url || '',
      icon: BsReddit,
      color: '#FF4500',
      bgColor: '#FFF0EB',
    },
    {
      name: 'Telegram',
      url: telegram_url || '',
      icon: BsTelegram,
      color: '#0088CC',
      bgColor: '#E3F2FD',
    },
    {
      name: 'Slack',
      url: slack_url || '',
      icon: BsSlack,
      color: '#4A154B',
      bgColor: '#F3E5F5',
    },
    {
      name: 'Medium',
      url: other_url_1 || '',
      icon: BsMedium,
      color: '#000000',
      bgColor: '#F5F5F5',
    },
    {
      name: 'Steemit',
      url: other_url_2 || '',
      icon: SiSteemit,
      color: '#4BA2F2',
      bgColor: '#E3F2FD',
    },
  ].filter(link => link.url && link.url !== '' && link.url !== '#');

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant='h6'
          sx={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'text.primary',
            mb: 3,
          }}
        >
          Official Links & Community
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 2,
          }}
        >
          {socialLinks.map(link => (
            <a
              key={link.name}
              href={link.url}
              target='_blank'
              rel='noopener noreferrer'
              className='group'
              style={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer',
                  height: '100%',
                  '&:hover': {
                    borderColor: link.color,
                    backgroundColor: link.bgColor,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${link.color}20`,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: link.bgColor,
                    mb: 1.5,
                    transition: 'all 0.2s ease-in-out',
                    '.group:hover &': {
                      backgroundColor: link.color,
                      color: 'white',
                    },
                  }}
                >
                  <link.icon
                    size={24}
                    style={{ color: link.color }}
                    className='group-hover:text-white transition-colors'
                  />
                </Box>
                <Typography
                  variant='body2'
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                  }}
                >
                  {link.name}
                </Typography>
              </Box>
            </a>
          ))}
        </Box>

        {/* Quick Stats */}
        <Box
          sx={{
            mt: 3,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Typography
            variant='body2'
            sx={{ color: 'text.secondary', mr: 1, fontWeight: 500 }}
          >
            Connect with us:
          </Typography>
          <Chip
            label={`${socialLinks.length} Platform${socialLinks.length > 1 ? 's' : ''}`}
            size='small'
            sx={{
              backgroundColor: 'primary.50',
              color: 'primary.700',
              fontWeight: 600,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default ExchangeSocialLinks;
