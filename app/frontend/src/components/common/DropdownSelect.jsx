import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

function DropdownSelect({ onExcludeChange }) {
  const [selected, setSelected] = React.useState('BTC');

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelected(newValue);
    // console.log('Dropdown selected:', newValue);
    onExcludeChange(newValue);
  };

  return (
    <div className="flex items-center">
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
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
            <option value="BTC">Bitcoin News</option>
            <option value="ETH">Ethereum News</option>
          </NativeSelect>
        </FormControl>
      </Box>
    </div>
  );
}

export default DropdownSelect;
