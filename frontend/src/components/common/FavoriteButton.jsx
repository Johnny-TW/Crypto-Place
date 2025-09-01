import React from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import { FavoriteRounded, FavoriteBorderRounded } from '@mui/icons-material';

function FavoriteButton({
  coinId,
  coinName,
  symbol,
  image,
  size = 'medium',
  onToggle,
  disabled = false,
  isFavorite = false,
  isLoading = false,
}) {
  const handleToggleFavorite = event => {
    // 防止事件冒泡到父元件
    event.stopPropagation();

    if (disabled || isLoading) return;

    // 通知父元件處理切換邏輯
    if (onToggle) {
      const coinData = {
        coinId,
        coinName,
        symbol: symbol?.toUpperCase(),
        image,
      };

      onToggle({
        ...coinData,
        action: isFavorite ? 'remove' : 'add',
        currentStatus: isFavorite,
      });
    }
  };

  if (isLoading) {
    return (
      <IconButton size={size} disabled>
        <CircularProgress size={size === 'small' ? 16 : 20} />
      </IconButton>
    );
  }

  return (
    <Tooltip
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      arrow
      placement='top'
    >
      <IconButton
        onClick={handleToggleFavorite}
        size={size}
        disabled={disabled}
        sx={{
          color: isFavorite ? '#e91e63' : '#9e9e9e',
          '&:hover': {
            color: '#e91e63',
            backgroundColor: 'rgba(233, 30, 99, 0.04)',
          },
          transition: 'color 0.2s ease-in-out',
        }}
      >
        {isFavorite ? <FavoriteRounded /> : <FavoriteBorderRounded />}
      </IconButton>
    </Tooltip>
  );
}

export default React.memo(FavoriteButton);
