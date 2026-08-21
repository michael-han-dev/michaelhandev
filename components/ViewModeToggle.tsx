'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function ViewModeToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const isAiMode = pathname.startsWith('/ai');

  const getHumanPath = () => {
    if (pathname === '/ai') return '/';
    if (pathname.startsWith('/ai/')) return pathname.replace('/ai', '');
    return pathname;
  };

  const getAiPath = () => {
    if (pathname === '/') return '/ai';
    if (pathname.startsWith('/ai')) return pathname;
    return `/ai${pathname}`;
  };

  const handleHumanClick = () => {
    router.push(getHumanPath());
  };

  const handleMachineClick = () => {
    router.push(getAiPath());
  };

  const activeClass = 'text-[var(--ink)]';
  const inactiveClass =
    'text-[var(--ink-3)] hover:text-[var(--ink-2)] transition-colors duration-150';

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
      <nav
        aria-label="View mode"
        className="pointer-events-auto flex items-center gap-2 font-mono text-[13px]"
      >
        <button
          onClick={handleHumanClick}
          aria-current={!isAiMode ? 'true' : undefined}
          className={!isAiMode ? activeClass : inactiveClass}
        >
          human
        </button>
        <span className="text-[var(--line)]">/</span>
        <button
          onClick={handleMachineClick}
          aria-current={isAiMode ? 'true' : undefined}
          className={isAiMode ? activeClass : inactiveClass}
        >
          machine
        </button>
      </nav>
    </div>
  );
}
