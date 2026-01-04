'use client';

import { useState, useRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyPageButtonProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export default function CopyPageButton({ contentRef }: CopyPageButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!contentRef.current) return;

    const textContent = contentRef.current.innerText
      .split('\n')
      .map(line => line.replace(/^│\s*/, ''))
      .join('\n')
      .trim();

    try {
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <button
      onClick={handleCopy}
      className="fixed top-6 right-6 z-50 p-2 bg-black/80 backdrop-blur-sm border border-slate-700/50 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 transition-all duration-200"
      title="Copy page content"
    >
      {copied ? (
        <Check size={16} className="text-green-400" />
      ) : (
        <Copy size={16} className="icon-glow" />
      )}
    </button>
  );
}

