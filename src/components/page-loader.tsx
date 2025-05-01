import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const PageLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 60); // Adjust speed here

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#9FB3DF] transition-opacity duration-700 ${
        progress === 100 ? 'opacity-0 pointer-events-none' : ''
      }`}
    > 
      <Image src="/svg.svg" alt="Icon" height={60} width={400} />
      {/* Spinner */}
      <div className="relative mb-4">
        <Loader2 className="h-20 w-20 animate-spin text-white" />
      </div>
      {/* Loading Text */}
      {/* <p className="text-lg font-bold text-gray-700 -translate-x-5 -translate-y-2">Loading... {progress}%</p> */}

      {/* Horizontal Progress Bar */}
      {/* <div className="w-64 h-2 bg-gray-300 mt-4 rounded-full translate-x-2">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
      </div> */}
    </div>
  );
};
