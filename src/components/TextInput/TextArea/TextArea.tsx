import React, { useState, useRef, useMemo, FC } from 'react';
interface TextAreaProps {
  placeholder?: string;
  className?: string;
  onChange: (value: string) => void;
}
import dynamic from 'next/dynamic';

const DynamicJoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const TextArea: FC<TextAreaProps> = ({ placeholder, className, onChange }) => {
  const editor = useRef(null);
  const [content, setContent] = useState('');

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || 'Start typing...',
    }),
    [placeholder],
  );

  return (
    <DynamicJoditEditor
      ref={editor}
      value={content}
      config={config}
      onBlur={newContent => setContent(newContent)}
      onChange={newContent => {
        setContent(newContent);
        onChange(newContent);
      }}
      className={className}
    />
  );
};

export default TextArea;
