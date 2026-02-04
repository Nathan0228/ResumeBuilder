import React from 'react';
import { Mail, Phone, MapPin, UserCircle } from 'lucide-react';

/** 简历预览 - 基本信息区块（姓名、职位、联系方式、照片） */
const BasicInfoBlock = ({ data }) => {
  const { personal } = data;
  return (
    <header className="mb-10 border-b border-gray-200 pb-10 flex justify-between items-start">
      <div className="flex-1">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
          {personal.name}
        </h1>
        <p className="text-xl text-indigo-600 font-medium mb-6">{personal.title}</p>
        <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-600">
          <div className="flex items-center gap-2 font-medium">
            <UserCircle size={14} className="text-gray-400" /> {personal.gender} / {personal.age}岁
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-gray-400" /> {personal.phone}
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-gray-400" /> {personal.email}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-gray-400" /> {personal.location}
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
