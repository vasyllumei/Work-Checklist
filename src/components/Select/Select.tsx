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
  leftIcon?: string;
}

interface SelectProps {
  value?: string | string[];
  options: Option[];
  onChange: (value: string | string[]) => void;
  label: string;
  multiple?: boolean;
  applyOnChange?: boolean;
  labelId?: string;
  id?: string;
  sx?: any;
}

export const SelectComponent: React.FC<SelectProps> = ({
  value,
  options,
  onChange,
  label,
  multiple,
  applyOnChange,
  labelId,
  id,
  sx,
}) => {
  const [selectedProp, setSelectedProp] = useState<string[]>([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const excludeRefs = [containerRef];
  const handleChange = (event: SelectChangeEvent<typeof selectedProp>) => {
    const {
      target: { value: selectedValues },
    } = event;

    setSelectedProp(Array.isArray(selectedValues) ? selectedValues : [selectedValues]);
  };
  const handleOpenSelect = () => {
    setIsSelectOpen(true);
  };
  const handleCloseSelect = () => {
    setIsSelectOpen(false);
  };
  const handleResetCheckbox = () => {
    setSelectedProp([]);
  };

  const handleApplyFilter = () => {
    onChange(selectedProp);
    handleCloseSelect();
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const isSelectOrCheckbox =
      containerRef.current &&
      (containerRef.current.contains(event.target as Node) || event.target instanceof HTMLInputElement);

    if (!isSelectOrCheckbox && applyOnChange) {
      handleApplyFilter();
    }
  };

  useOutsideClick(handleOutsideClick, containerRef, excludeRefs);
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
            open={isSelectOpen}
            onOpen={handleOpenSelect}
            onClose={handleCloseSelect}
          >
            {options.map(option => (
              <MenuItem key={option.label} value={option.value}>
                <Checkbox checked={selectedProp.indexOf(option.value) > -1} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
            {applyOnChange ? null : (
              <div>
                <Divider />
                <div className={styles.multiSelectButton}>
                  <Button text="Clear" onClick={handleResetCheckbox} size="small" outlined={true} />
                  <Button text="Apply" onClick={handleApplyFilter} size="small" />
                </div>
              </div>
            )}
          </Select>
        </FormControl>
      ) : (
        <FormControl size="small" className={styles.formControl}>
          <InputLabel>{label}</InputLabel>
          <Select
            labelId={labelId}
            id={id}
            value={value || ''}
            label={label}
            onChange={e => onChange(e.target.value)}
            sx={sx}
          >
            {options.map(({ value, label, leftIcon: LeftIcon }) => (
              <MenuItem key={value} value={value}>
                {LeftIcon && (
                  <div className={styles.iconContainer}>
                    <LeftIcon />
                  </div>
                )}
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};
