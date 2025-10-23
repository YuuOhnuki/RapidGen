"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';

export const TransitionScreen: React.FC<{ message?: string }> = ({ message = '編集画面に移行しています...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center gap-4 w-[90%] max-w-md">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="text-center text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default TransitionScreen;
