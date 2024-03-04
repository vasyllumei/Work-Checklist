import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Checkbox, Divider, ListItemText } from '@mui/material';
import { Button } from '@/components/Button';
import styles from './Select.module.css';
import { useRef, useState } from 'react';
import useOutsideClick from '@/hooks/useOutsideClick';

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
  outsideClick?: boolean;
}

export const SelectComponent: React.FC<SelectProps> = ({ value, options, onChange, label, multiple, outsideClick }) => {
  const [selectedProp, setSelectedProp] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const excludeRefs = [containerRef];

  const handleOutsideClick = () => {
    if (outsideClick) {
      onChange(selectedProp);
    }
  };

  useOutsideClick(handleOutsideClick, containerRef, excludeRefs);

  const handleChange = (event: SelectChangeEvent<typeof selectedProp>) => {
    const {
      target: { value },
    } = event;

    setSelectedProp(Array.isArray(value) ? value : [value]);
  };
  const handleResetCheckbox = () => {
    setSelectedProp([]);
  };

  return (
    <Box>
      {multiple ? (
        <FormControl size="small" sx={{ m: 1, width: 300 }} ref={containerRef}>
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
              <MenuItem key={option.label} value={option.value}>
                <Checkbox checked={selectedProp.indexOf(option.value) > -1} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}

            {outsideClick ? null : (
              <div>
                <Divider />
                <div className={styles.multiSelectButton}>
                  <Button text="Clear" onClick={handleResetCheckbox} size="small" outlined={true} />
                  <Button text="Apply" onClick={() => onChange(selectedProp)} size="small" />
                </div>
              </div>
            )}
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
