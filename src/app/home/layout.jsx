import Sidenav from '@/components/sidenav';
import React from 'react';

const layout = ({ children }) => {
  return (
    <div className="flex flex-1 overflow-y-hidden">
      <Sidenav />
      <div className="flex flex-col w-full h-full flex-1 overflow-y-hidden">
        <div className="container h-full mx-auto bg-gray-800 shadow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
