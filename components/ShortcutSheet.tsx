'use client';

import { motion, AnimatePresence } from 'framer-motion';

const shortcuts: Array<[string, string]> = [
  ['g', 'GitHub'],
  ['t', 'Twitter'],
  ['l', 'LinkedIn'],
  ['s', 'Source'],
  ['h', 'Human mode / home'],
  ['p', 'Projects'],
  ['e', 'Experience'],
  ['w', 'Writing'],
  ['m', 'Toggle human / machine'],
  ['?', 'This panel'],
  ['esc', 'Close'],
];

export default function ShortcutSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[70]"
        >
          <button
            aria-label="Close shortcuts"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/20"
          />
          <motion.div
            role="dialog"
            aria-label="Keyboard shortcuts"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-[18vh] w-[min(24rem,calc(100vw-3rem))] border border-[var(--line)] bg-[var(--paper)] p-6"
          >
            <h2 className="eyebrow">Keyboard</h2>
            <dl className="mt-4 space-y-2">
              {shortcuts.map(([key, label]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <dt>
                    <kbd className="border border-[var(--line)] px-1.5 py-0.5 font-mono text-xs text-[var(--ink-2)]">
                      {key}
                    </kbd>
                  </dt>
                  <dd className="text-sm text-[var(--ink-2)]">{label}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
