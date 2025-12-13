import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronDown, ChevronUp, Pin, Clock } from 'lucide-react';

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

  const getCategoryInfo = (category: string) => {
    const categories: {
      [key: string]: { bg: string; text: string; label: string };
    } = {
      general: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'General' },
      software_release: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        label: 'Software Release',
      },
      milestone: {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        label: 'Milestone',
      },
      partnership: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        label: 'Partnership',
      },
      event: { bg: 'bg-red-50', text: 'text-red-700', label: 'Event' },
    };
    return categories[category] || categories.general;
  };

  return (
    <div className='space-y-4'>
      {displayedUpdates.map((update, index) => {
        const categoryInfo = getCategoryInfo(update.category);
        return (
          <div
            key={`${update.created_at}-${index}`}
            className={`
              p-4 rounded-xl border transition-all duration-200
              ${
                update.pin
                  ? 'border-blue-200 bg-blue-50/30'
                  : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm'
              }
            `}
          >
            {/* Header */}
            <div className='flex items-start justify-between mb-3'>
              <div className='flex items-center gap-2'>
                {update.pin && (
                  <Pin className='w-4 h-4 text-blue-500 flex-shrink-0' />
                )}
                <Badge
                  variant='secondary'
                  className={`${categoryInfo.bg} ${categoryInfo.text} hover:${categoryInfo.bg}`}
                >
                  {categoryInfo.label}
                </Badge>
              </div>
              <div className='flex items-center gap-1 text-gray-400 text-xs'>
                <Clock className='w-3 h-3' />
                <span>{formatDate(update.created_at)}</span>
              </div>
            </div>

            {/* Content */}
            <p className='text-sm text-gray-700 leading-relaxed mb-4'>
              {update.description}
            </p>

            {/* Footer */}
            <div className='flex items-center gap-2 pt-3 border-t border-gray-100/50'>
              <Avatar className='w-6 h-6'>
                <AvatarFallback className='text-[10px] bg-blue-100 text-blue-700'>
                  {update.user.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className='text-xs font-semibold text-gray-600'>
                {update.user}
              </span>
              <span className='text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500'>
                {update.user_title}
              </span>
            </div>
          </div>
        );
      })}

      {/* Show More Button */}
      {status_updates.length > 3 && (
        <Button
          variant='ghost'
          className='w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50'
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <ChevronUp className='w-4 h-4 mr-2' />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className='w-4 h-4 mr-2' />
              Show More ({status_updates.length - 3})
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export default ExchangeAnnouncements;
