import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Button,
} from '@mui/material';
import { BsChevronDown, BsChevronUp, BsPin, BsClock } from 'react-icons/bs';

interface StatusUpdate {
  description: string;
  category: string;
  created_at: string;
  user: string;
  user_title: string;
  pin: boolean;
  project: {
    type: string;
    id: string;
    name: string;
    image: {
      thumb: string;
      small: string;
      large: string;
    };
  };
}

interface ExchangeAnnouncementsProps {
  status_updates: StatusUpdate[];
  exchangeName: string;
}

function ExchangeAnnouncements({
  status_updates,
  exchangeName: _exchangeName,
}: ExchangeAnnouncementsProps) {
  const [showAll, setShowAll] = useState(false);

  if (!status_updates || status_updates.length === 0) {
    return null;
  }

  const displayedUpdates = showAll
    ? status_updates
    : status_updates.slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} months ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      general: { bg: '#EDF2F7', text: '#4A5568' },
      software_release: { bg: '#E7F3FF', text: '#1877F2' },
      milestone: { bg: '#FFF0EB', text: '#FF4500' },
      partnership: { bg: '#F0FFF4', text: '#38A169' },
      event: { bg: '#FFF5F5', text: '#E53E3E' },
    };
    return colors[category] || colors.general;
  };

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
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant='h6'
              sx={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              📢 Latest Announcements
            </Typography>
            <Chip
              label={status_updates.length}
              size='small'
              sx={{
                backgroundColor: 'primary.50',
                color: 'primary.700',
                fontWeight: 600,
                height: 20,
                fontSize: '0.75rem',
              }}
            />
          </Box>
        </Box>

        {/* Announcements List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {displayedUpdates.map((update, index) => {
            const categoryColor = getCategoryColor(update.category);
            return (
              <Box
                key={`${update.created_at}-${index}`}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: update.pin ? 'primary.main' : 'divider',
                  backgroundColor: update.pin
                    ? 'primary.50'
                    : 'background.paper',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.50',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {update.pin && (
                      <BsPin
                        size={16}
                        style={{ color: '#3B82F6', flexShrink: 0 }}
                      />
                    )}
                    <Chip
                      label={update.category.replace('_', ' ')}
                      size='small'
                      sx={{
                        backgroundColor: categoryColor.bg,
                        color: categoryColor.text,
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        height: 24,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      color: 'text.secondary',
                    }}
                  >
                    <BsClock size={14} />
                    <Typography
                      variant='caption'
                      sx={{ fontSize: '0.75rem', fontWeight: 500 }}
                    >
                      {formatDate(update.created_at)}
                    </Typography>
                  </Box>
                </Box>

                {/* Content */}
                <Typography
                  variant='body2'
                  sx={{
                    color: 'text.primary',
                    lineHeight: 1.6,
                    mb: 1.5,
                    fontSize: '0.875rem',
                  }}
                >
                  {update.description}
                </Typography>

                {/* Footer */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    pt: 1.5,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: '0.75rem',
                      backgroundColor: 'primary.main',
                    }}
                  >
                    {update.user.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography
                    variant='caption'
                    sx={{
                      fontSize: '0.75rem',
                      color: 'text.secondary',
                      fontWeight: 600,
                    }}
                  >
                    {update.user}
                  </Typography>
                  <Chip
                    label={update.user_title}
                    size='small'
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      backgroundColor: 'grey.100',
                      color: 'text.secondary',
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Show More Button */}
        {status_updates.length > 3 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={() => setShowAll(!showAll)}
              endIcon={showAll ? <BsChevronUp /> : <BsChevronDown />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.50',
                },
              }}
            >
              {showAll ? 'Show Less' : `Show ${status_updates.length - 3} More`}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default ExchangeAnnouncements;
