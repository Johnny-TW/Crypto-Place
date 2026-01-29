import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DropdownSelectProps {
  onExcludeChange: (value: string) => void;
}

const cryptoOptions = [
  { value: 'BTC', label: 'Bitcoin' },
  { value: 'ETH', label: 'Ethereum' },
  { value: 'SOL', label: 'Solana' },
  { value: 'XRP', label: 'Ripple' },
  { value: 'ADA', label: 'Cardano' },
  { value: 'DOGE', label: 'Dogecoin' },
];

function DropdownSelect({ onExcludeChange }: DropdownSelectProps) {
  const [selected, setSelected] = useState<string>('BTC');

  const handleValueChange = (newValue: string): void => {
    setSelected(newValue);
    onExcludeChange(newValue);
  };

  return (
    <div className='flex items-center gap-3'>
      <Select value={selected} onValueChange={handleValueChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Select crypto' />
        </SelectTrigger>
        <SelectContent>
          {cryptoOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              <span className='flex items-center gap-2'>
                <span>{option.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default DropdownSelect;
