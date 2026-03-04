import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, UserCircle, Link as LinkIcon } from 'lucide-react';

const formatLocation = (personal, t) => {
  if (personal.country && personal.country !== 'OTHER') {
    const parts = [t(`countries.${personal.country}`)];
    if (personal.province && (personal.country === 'CN' || personal.country === 'US')) {
      parts.push(t(`region.${personal.country}.${personal.province}`));
    }
    if (personal.city) parts.push(personal.city);
    return parts.join(', ');
  }
  if (personal.country === 'OTHER' && personal.city) return personal.city;
  return personal.location || '';
};

const formatGender = (gender, t) => {
  if (!gender) return '';
  if (gender === '男') return t('builder.male');
  if (gender === '女') return t('builder.female');
  if (gender === '保密') return t('builder.preferNotSay');
  return gender;
};

const SidebarInfo = ({ data }) => {
  const { t } = useTranslation();
  const { personal } = data;
  const links = personal.links || [];
  const locationText = formatLocation(personal, t);

  return (
    <aside className="w-full flex flex-col border-r border-gray-200 pr-4 print:pr-2">
      {/* 头像 */}
      {personal.photo && (
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 mb-4 mx-auto">
          <img src={personal.photo} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <h1 className="text-lg font-bold text-gray-900 mb-0.5 leading-tight">
        {personal.name}
      </h1>
      <p className="text-sm text-gray-600 mb-4">{personal.title}</p>

      {/* 联系方式 */}
      <div className="space-y-2 text-xs text-gray-600 mb-4">
        {personal.email && (
          <a href={`mailto:${personal.email}`} className="flex items-center gap-2 hover:text-indigo-600 break-all">
            <Mail size={12} className="shrink-0 text-gray-400" />
            {personal.email}
          </a>
        )}
        {personal.phone && (
          <div className="flex items-center gap-2">
            <Phone size={12} className="shrink-0 text-gray-400" />
            {personal.phone}
          </div>
        )}
        {locationText && (
          <div className="flex items-center gap-2">
            <MapPin size={12} className="shrink-0 text-gray-400" />
            {locationText}
          </div>
        )}
        {(personal.gender || personal.age) && (
          <div className="flex items-center gap-2">
            <UserCircle size={12} className="shrink-0 text-gray-400" />
            {formatGender(personal.gender, t)}
            {personal.gender && personal.age ? ' / ' : ''}
            {personal.age ? `${personal.age}${t('preview.yearsOld')}` : ''}
          </div>
        )}
      </div>

      {links.length > 0 && (
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <LinkIcon size={10} /> {t('preview.links')}
          </div>
          <ul className="space-y-1.5">
            {links.filter((l) => l.label || l.url).map((link) => {
              const url = link.url?.trim();
              const label = link.label || link.url || t('preview.linkLabel');
              return (
              <li key={link.id}>
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:underline break-all"
                  >
                    {label}
                  </a>
                ) : (
                  <span className="text-xs text-gray-500 break-all">{label}</span>
                )}
              </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
};

export default SidebarInfo;
