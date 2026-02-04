import React from 'react';
import { monthToDisplay } from '../../../utils/dateFormat';

/** 简历预览 - 荣誉奖项区块 */
const HonorsBlock = ({ data }) => {
  const { honors } = data;
  if (!honors?.length) return null;
  return (
    <section>
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-6 border-l-4 border-indigo-600 pl-3">
        荣誉奖项
      </h3>
      <div className="space-y-2">
        {honors.map((item) => (
          <div key={item.id} className="flex justify-between items-start gap-4">
            <div>
              <div className=" text-[13px] ">{item.title}</div>
              {item.description && (
                <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-line mt-0.5">
                  ——{item.description}
                </p>
              )}
            </div>
            {item.date && (
              <span className="text-xs text-gray-500 font-mono shrink-0">
                {item.date.includes('-') ? monthToDisplay(item.date) : item.date}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HonorsBlock;
