import React from 'react';
import { formatDateRange } from '../../../utils/dateFormat';

/** 简历预览 - 教育背景区块（含校内经历、GPA、所修课程） */
const EducationBlock = ({ data }) => {
  const { education } = data;
  if (!education?.length) return null;

  const parseCourses = (courses) => {
    if (!courses?.trim()) return [];
    return courses
      .split(/[\n,，]/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  return (
    <section>
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-6 border-l-4 border-indigo-600 pl-3">
        教育背景
      </h3>
      <div className="space-y-5">
        {education.map((edu) => (
          <div key={edu.id} className="space-y-2">
            <div className="flex justify-between items-baseline gap-4">
              <div>
                <div className="font-bold text-gray-900">{edu.school}</div>
                <div className="text-xs text-gray-500 font-bold mt-0.5">
                  {edu.degree}
                  {edu.gpa && (
                    <span className="ml-2 text-gray-600">GPA {edu.gpa}</span>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500 font-bold font-mono shrink-0">
                {formatDateRange(edu.startDate, edu.endDate, edu.isPresent, edu.date)}
              </span>
            </div>
            {edu.campusExperience && (
              <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-line">
                {edu.campusExperience}
              </p>
            )}
            {edu.courses && parseCourses(edu.courses).length > 0 && (
              <div className="text-[12px] text-gray-500">
                <span className="font-medium text-gray-600">主修课程：</span>
                {parseCourses(edu.courses).join('、')}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default EducationBlock;
