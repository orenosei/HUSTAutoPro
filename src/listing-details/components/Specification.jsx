import IconField from '@/add-listing/components/IconField';
import CarSpecification from '@/Shared/CarSpecification';
import React from 'react';

function Specification({ carDetail }) {
  return (
    <div>
      {carDetail ? (
        <div className="p-10 rounded-xl bg-white shadow-md mt-6 border border-gray-200">
          <h2 className="text-2xl font-semibold">Thông Số</h2>
          {CarSpecification.map((item, index) => (
            <div className="mt-5 flex items-center justify-between" key={index}>
              <h2 className="flex gap-2">
                <IconField icon={item.icon} />
                {item.label}
              </h2>
              <h2>{carDetail[item.name] || 'N/A'}</h2>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full mt-7 h-[150px] bg-slate-200 animate-pulse rounded-xl"></div>
      )}
    </div>
  );
}

export default Specification;
