import React from 'react';
import { FaCheck } from 'react-icons/fa6';

function Features({ features }) {
  return (
    <div>
      {features && Object.keys(features).length > 0 ? (
        <div className="p-10 rounded-xl bg-white shadow-md mt-6 border border-gray-200">
          <h2 className="text-2xl font-semibold">Features</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
            {Object.entries(features).map(([feature, value], index) => (
              <div key={index} className="flex gap-2 items-center">
                <FaCheck className="text-blue-500 text-lg p-1 rounded-full bg-blue-100" />
                <h2>{feature}</h2>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full mt-7 h-[100px] bg-slate-200 animate-pulse rounded-xl"></div>
      )}
    </div>
  );
}

export default Features;
