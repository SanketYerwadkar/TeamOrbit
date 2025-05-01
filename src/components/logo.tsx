import { Ubuntu } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

const font = Ubuntu({
  weight: ['700'],
  subsets: ['latin'],
});

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-x-1.5 ">
      <Image
      className='rounded-2xl h-15'
        // className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl p-1"
        src="/logo2.svg"
        alt="Icon"
        height={30}
        width={225}
      />
      {/* <p className={cn('text-2xl  font-bold', font.className)}></p> */}
    </Link>
  );
};
