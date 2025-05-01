'use client';

import { Settings, UsersIcon } from 'lucide-react';
import { Video } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from 'react-icons/go';

import { FileText } from 'lucide-react'; // add this import

import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

const routes = [
  {
    label: 'Dashboard',
    href: '',
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: 'Tasks',
    href: '/tasks',
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: 'Setting',
    href: '/settings',
    icon: Settings,
    activeIcon: Settings,
  },
  {
    label: 'Members',
    href: '/members',
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
  {
    label: 'Video Call',
    href: '/video-call',
    icon: Video,
    activeIcon: Video,
  },
  {
    label: 'File Share',
    href: '/file-share',
    icon: FileText,
    activeIcon: FileText,
  },
];

export const Navigation = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();

  return (
    <ul className="flex flex-col border rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl p-2">
      {/* if here paste a glass effect then its should be display a contain to bar at left sidebar */}
      {routes.map((route) => {
        const fullHref = `/workspaces/${workspaceId}${route.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? route.activeIcon : route.icon;

        return (
          <li key={fullHref}>
            <Link
              href={fullHref}
              className={cn(
                'flex items-center my-1 bg-white gap-3 rounded-md p-2.5 font-medium text-black-500   ',
                isActive && 'bg-[#134B70] text-primary shadow-sm text-white',
              )}
            >
              <Icon className="size-5 text-black-500  " />
              {route.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
