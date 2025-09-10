import React from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import { FavoriteRounded, FavoriteBorderRounded } from '@mui/icons-material';

interface CoinData {
  coinId: string;
  coinName: string;
  symbol: string;
  image: string;
}

interface ToggleData extends CoinData {
  action: 'add' | 'remove';
  currentStatus: boolean;
}

interface FavoriteButtonProps {
  coinId: string;
  coinName: string;
  symbol: string;
  image: string;
  size?: 'small' | 'medium' | 'large';
  // eslint-disable-next-line no-unused-vars
  onToggle?: (data: ToggleData) => void;
  disabled?: boolean;
  isFavorite?: boolean;
  isLoading?: boolean;
}

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
}: FavoriteButtonProps) {
  const handleToggleFavorite = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    // 防止事件冒泡到父元件
    event.stopPropagation();

    if (disabled || isLoading) return;

    // 通知父元件處理切換邏輯
    if (onToggle) {
      const coinData: CoinData = {
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
