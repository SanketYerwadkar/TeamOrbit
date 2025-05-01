import { Suspense } from 'react';

import { DottedSeparator } from './dotted-separator';
import { Logo } from './logo';
import { Navigation } from './navigation';
import { Projects } from './projects';
import { WorkspaceSwitcher } from './workspaces-switcher';

export const Sidebar = () => {
  return (
    <aside className="min-h-screen w-66 p-2 bg-[#7a9ab3]">
      <Logo />

      <DottedSeparator className="my-4" />

      <Suspense>
        <WorkspaceSwitcher />
      </Suspense>

      <DottedSeparator className="my-4" />

      <Navigation />

      <DottedSeparator className="my-4" />

      <Suspense>
        <Projects />
      </Suspense>
    </aside>
  );
};
// rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl p-6
