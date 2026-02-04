import React from 'react';

/** 简历预览 - 专业技能区块 */
const SkillsBlock = ({ data }) => {
  const { skills } = data;
  if (!skills?.length) return null;
  return (
    <section>
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-4 border-l-4 border-indigo-600 pl-3">
        专业技能
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((s, i) => (
          <span
            key={i}
            className="bg-gray-100 px-3 py-1 rounded-full text-[11px] font-bold text-gray-600 border border-gray-200"
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
};

export default SkillsBlock;
