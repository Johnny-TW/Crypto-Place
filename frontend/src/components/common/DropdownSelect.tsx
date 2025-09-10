import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

interface DropdownSelectProps {
  // eslint-disable-next-line no-unused-vars
  onExcludeChange: (value: string) => void;
}

function DropdownSelect({ onExcludeChange }: DropdownSelectProps) {
  const [selected, setSelected] = useState<string>('BTC');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const newValue = event.target.value;
    setSelected(newValue);
    // eslint-disable-next-line no-console
    console.log('Dropdown selected:', newValue);
    onExcludeChange(newValue);
  };

  return (
    <div className='flex items-center'>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel variant='standard' htmlFor='uncontrolled-native'>
            Crypto News
          </InputLabel>
          <NativeSelect
            value={selected}
            onChange={handleChange}
            inputProps={{
              name: 'crypto-news',
              id: 'uncontrolled-native',
            }}
          >
            <option value='BTC'>Bitcoin News</option>
            <option value='ETH'>Ethereum News</option>
          </NativeSelect>
        </FormControl>
      </Box>
    </div>
  );
}

export default DropdownSelect;
