import React, { useState, useRef, useMemo, FC } from 'react';
import dynamic from 'next/dynamic';
import { textAreaConfig } from '@/components/TextInput/TextArea/textAreaConfig';

interface TextAreaProps {
  onChange: (value: string) => void;
  value: string | number;
}

const DynamicJoditEditor = dynamic(() => import('jodit-react').then(module => module.default), { ssr: false });

const TextArea: FC<TextAreaProps> = ({ onChange, value }) => {
  const editor = useRef(null);
  const [content, setContent] = useState(value.toString());
  const config = useMemo(() => textAreaConfig(), []);

  return (
    <div>
      <DynamicJoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={newContent => setContent(newContent)}
        onChange={newContent => {
          onChange(newContent);
        }}
      />
    </div>
  );
};

export default TextArea;
