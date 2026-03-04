import React from 'react';
import { useTranslation } from 'react-i18next';

const ExamInfoBlock = ({ data }) => {
  const { t } = useTranslation();
  const exam = data.examInfo;
  if (!exam) return null;

  const hasAny =
    exam.university ||
    exam.major ||
    exam.degreeType ||
    exam.politics ||
    exam.english ||
    exam.course1 ||
    exam.course2 ||
    exam.course1Name ||
    exam.course2Name ||
    exam.totalScore;
  if (!hasAny) return null;

  const degreeLabel =
    exam.degreeType === 'professional'
      ? t('builder.professionalMaster')
      : exam.degreeType === 'academic'
        ? t('builder.academicMaster')
        : exam.degreeType || '';

  return (
    <section>
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-6 border-l-4 border-indigo-600 pl-3">
        {t('blocks.examInfo')}
      </h3>
      <div className="space-y-4">
        {(exam.university || exam.major || degreeLabel) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
            {exam.university && <span>{exam.university}</span>}
            {exam.major && <span>{exam.major}</span>}
            {degreeLabel && <span className="text-gray-600">{degreeLabel}</span>}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <tbody>
              <tr className="bg-gray-50">
                <th rowSpan={2} className="border border-gray-300 px-3 py-2 text-left align-middle font-semibold text-gray-900 w-24">
                  {t('builder.preliminaryScores')}
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-800">{t('builder.politics')}</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-800">{t('builder.english')}</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-800">{t('builder.course1')}</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-800">{t('builder.course2')}</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-800">{t('builder.totalScore')}</th>
                
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">{exam.politics || '—'}</td>
                <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">{exam.english || '—'}</td>
                <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">{exam.course1 || '—'}</td>
                <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">{exam.course2 || '—'}</td>
                <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">{exam.totalScore || '—'}</td>
                
              </tr>
            </tbody>
          </table>
        </div>
        {(exam.course1Name || exam.course2Name) && (
          <div className="text-[11px] text-gray-600 flex flex-wrap gap-x-4">
            {exam.course1Name && <span>{t('builder.course1')}：{exam.course1Name}</span>}
            {exam.course2Name && <span>{t('builder.course2')}：{exam.course2Name}</span>}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExamInfoBlock;
