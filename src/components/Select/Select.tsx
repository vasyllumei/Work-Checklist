import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Checkbox, Divider, ListItemText } from '@mui/material';
import { Button } from '@/components/Button';
import styles from './Select.module.css';
import { useState } from 'react';

export interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  value: string | string[];
  options: Option[];
  onChange: (value: string | string[]) => void;
  label: string;
  multiple?: boolean;
}

export const SelectComponent: React.FC<SelectProps> = ({ value, options, onChange, label, multiple }) => {
  const [selectedProp, setSelectedProp] = useState<string[]>([]);
  const handleChange = (event: SelectChangeEvent<typeof selectedProp>) => {
    const {
      target: { value },
    } = event;
    setSelectedProp(_prevSelected => {
      if (typeof value === 'string') {
        return [value];
      } else {
        return value;
      }
    });
  };

  const handleResetCheckbox = () => {
    setSelectedProp([]);
  };

  return (
    <Box>
      {multiple ? (
        <FormControl size="small" sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            label={label}
            value={selectedProp}
            onChange={handleChange}
            renderValue={selected => selected.join(', ')}
          >
            {options.map(option => (
              <MenuItem key={option.value} value={option.label}>
                <Checkbox checked={selectedProp.indexOf(option.label) > -1} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
            <Divider />
            <div className={styles.multiSelectButton}>
              <Button text="Clear" onClick={handleResetCheckbox} size="small" outlined={true} />
              <Button text="Apply" onClick={() => onChange(selectedProp)} size="small" />
            </div>
          </Select>
        </FormControl>
      ) : (
        <FormControl size="small" sx={{ m: 1, width: 250 }}>
          <InputLabel id="demo-simple-select-label">{label}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select-autowidth"
            value={value || ''}
            label={label}
            onChange={e => onChange(e.target.value)}
          >
            {options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};
