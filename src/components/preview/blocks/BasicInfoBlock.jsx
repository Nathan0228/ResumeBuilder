import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, UserCircle } from 'lucide-react';

/** 简历预览 - 基本信息区块（姓名、职位、联系方式、照片） */
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

const BasicInfoBlock = ({ data }) => {
  const { t } = useTranslation();
  const { personal } = data;
  const locationText = formatLocation(personal, t);
  const genderText = formatGender(personal.gender, t);
  return (
    <header className="mb-10 border-b border-gray-200 pb-10 flex justify-between items-start">
      <div className="flex-1">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
          {personal.name}
        </h1>
        <p className="text-xl text-indigo-600 font-medium mb-6">{personal.title}</p>
        <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-600">
          <div className="flex items-center gap-2 font-medium">
            <UserCircle size={14} className="text-gray-400" /> {genderText}{genderText && personal.age ? ' / ' : ''}{personal.age}{personal.age ? t('preview.yearsOld') : ''}
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-gray-400" /> {personal.phone}
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-gray-400" /> {personal.email}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-gray-400" /> {locationText}
          </div>
        </div>
      </div>
      {personal.photo && (
        <div className="w-28 h-36 ml-8 rounded shadow-md border border-gray-100 overflow-hidden shrink-0">
          <img src={personal.photo} alt="Profile" className="w-full h-full object-cover" />
        </div>
      )}
    </header>
  );
};

export default BasicInfoBlock;
