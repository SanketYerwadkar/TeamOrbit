'use client';

import { usePathname } from 'next/navigation';

import { UserButton } from '@/features/auth/components/user-button';

import { MobileSidebar } from './mobile-sidebar';
import { SourceCode } from './source-code';

const pathnameMap = {
  tasks: {
    title: 'Tasks',
    description: 'View all of your tasks here.',
  },
  projects: {
    title: 'Project',
    description: 'View tasks of your project here.',
  },
};

const defaultMap = {
  title: 'Dashboard',
  description: 'Monitor all of your projects and tasks here.',
};

export const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split('/');
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="flex items-center justify-between px-6 pt-4   " style={{ backgroundColor: '#9FB3DF' }}>
      <div className="hidden w-[1050px] h-15 flex-col lg:flex rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl p-2  ">
        <h1 className="text-2xl text-white font-semibold rounded-2xl bg-[#2E5077]  backdrop-blur-lg border border-white/30 shadow-2xl p-4 ">
          {title}
        </h1>
        <p> </p>
        <p className=" text-white pl-2  pt-2">{description}</p>
        {/* rounded-2xl  backdrop-blur-lg border border-white/30 shadow-2xl p-6 */}
      </div>

      <MobileSidebar />

      <div className="flex items-center gap-x-2.5">
        <UserButton />

        <SourceCode />
      </div>
    </nav>
  );
};
