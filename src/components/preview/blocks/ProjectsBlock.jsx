import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateRange } from '../../../utils/dateFormat';
import { accentStyle, getAccentDarkHex } from '../../../utils/accentColor';

const ProjectsBlock = ({ data, titleGap = 'mb-6', accent }) => {
  const { t } = useTranslation();
  const { projects } = data;
  if (!projects?.length) return null;

  return (
    <section>
      <h3 className={`text-xs font-bold text-gray-900 uppercase tracking-[0.2em] ${titleGap} border-l-4 pl-3`} style={accentStyle(accent, 'borderColor')}>
        {t('blocks.projects')}
      </h3>
      <div className="space-y-2">
        {projects.map((project) => (
          <div key={project.id}>
            <div className="flex justify-between items-baseline font-bold text-gray-900 mb-1">
              <span className="text-base">{project.name}</span>
              {project.showDate !== false && (
                <span className="text-xs text-gray-500 font-mono">
                  {formatDateRange(project.startDate, project.endDate, project.isPresent, project.date, t('builder.present'))}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 text-xs mb-2">
              <span className="font-semibold" style={accentStyle(accent, 'text')}>{project.role}</span>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: '#6b7280' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = getAccentDarkHex(accent); }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}
                >
                  {project.link}
                </a>
              )}
            </div>
            {project.description && (
              <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-line border-l border-gray-100 pl-4">
                {project.description}
              </p>
            )}
            {project.technologies && (
              <p className="text-xs text-gray-500 mt-2">
                <span className="font-medium">{t('builder.technologies')}: </span>
                {project.technologies}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsBlock;
