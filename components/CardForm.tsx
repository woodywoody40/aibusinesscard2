import React, { useState, useEffect } from 'react';
import type { BusinessCard } from '../types.ts';
import { UserIcon } from './icons/UserIcon.tsx';
import { PhoneIcon } from './icons/PhoneIcon.tsx';
import { EmailIcon } from './icons/EmailIcon.tsx';
import { CompanyIcon } from './icons/CompanyIcon.tsx';
import { TitleIcon } from './icons/TitleIcon.tsx';
import { SaveIcon } from './icons/SaveIcon.tsx';
import { BackIcon } from './icons/BackIcon.tsx';
import { AddressIcon } from './icons/AddressIcon.tsx';
import { WebsiteIcon } from './icons/WebsiteIcon.tsx';
import { SocialIcon } from './icons/SocialIcon.tsx';
import { motion } from 'framer-motion';

interface CardFormProps {
  initialData: Partial<BusinessCard>;
  onSave: (card: Omit<BusinessCard, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
  onResetApiKey: () => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
    <div className="flex items-center gap-4 py-3 border-b border-morandi-muted-light/30 dark:border-morandi-muted-dark/30 focus-within:border-morandi-accent-light dark:focus-within:border-morandi-accent-dark transition-colors duration-200">
        <span className="text-morandi-accent-light dark:text-morandi-accent-dark">{icon}</span>
        {children}
    </div>
);

const CardForm: React.FC<CardFormProps> = ({ initialData, onSave, onCancel, isLoading, error, onResetApiKey }) => {
  const [formData, setFormData] = useState<Partial<BusinessCard>>({
    name: '',
    phone: '',
    email: '',
    company: '',
    title: '',
    address: '',
    website: '',
    social: '',
    industry: 'General',
    ...initialData,
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, ...initialData }));
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image) {
        alert("姓名和圖片為必填欄位");
        return;
    }
    const dataToSave: Omit<BusinessCard, 'id' | 'createdAt'> = {
      name: formData.name || '',
      phone: formData.phone || '',
      email: formData.email || '',
      company: formData.company || '',
      title: formData.title || '',
      image: formData.image,
      address: formData.address || '',
      website: formData.website || '',
      social: formData.social || '',
      industry: formData.industry || 'General',
    };
    onSave(dataToSave);
  };

  const isEditing = !!initialData.id;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <motion.button 
          onClick={onCancel} 
          className="flex items-center gap-2 text-morandi-muted-light dark:text-morandi-muted-dark hover:text-morandi-accent-light dark:hover:text-morandi-accent-dark transition-colors p-2 rounded-lg"
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <BackIcon className="w-5 h-5" />
          返回
        </motion.button>
        <h2 className="text-xl font-bold text-morandi-foreground-light dark:text-morandi-foreground-dark">
          {isEditing ? '編輯名片' : '檢視與儲存'}
        </h2>
        <div className="w-20"></div>
      </div>

      {initialData.image && (
        <img src={initialData.image} alt="Scanned card" className="w-full rounded-2xl mb-6 shadow-md" />
      )}
      
      {isLoading && (
        <div className="text-center p-6 bg-morandi-card-light dark:bg-morandi-card-dark rounded-2xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-morandi-accent-light dark:border-morandi-accent-dark mx-auto mb-3"></div>
          <p className="text-morandi-muted-light dark:text-morandi-muted-dark">AI 正在為您分析名片...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-4 my-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400">
          <p className="font-semibold">分析失敗</p>
          <p className="text-sm mt-1">{error}</p>
          {error.toLowerCase().includes("api key") && (
            <button onClick={onResetApiKey} className="mt-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-3 py-1 text-sm font-semibold rounded-lg hover:bg-red-200 dark:hover:bg-red-900 transition-colors">
              重設 API Key
            </button>
          )}
        </div>
      )}

      {!isLoading && (
        <form onSubmit={handleSubmit} className="space-y-3">
            <InfoRow icon={<UserIcon className="w-5 h-5"/>}>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="姓名" className="w-full bg-transparent outline-none text-morandi-foreground-light dark:text-morandi-foreground-dark placeholder:text-morandi-muted-light dark:placeholder:text-morandi-muted-dark" />
            </InfoRow>
            <InfoRow icon={<CompanyIcon className="w-5 h-5"/>}>
                <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="公司" className="w-full bg-transparent outline-none text-morandi-foreground-light dark:text-morandi-foreground-dark placeholder:text-morandi-muted-light dark:placeholder:text-morandi-muted-dark" />
            </InfoRow>
            <InfoRow icon={<TitleIcon className="w-5 h-5"/>}>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="職稱" className="w-full bg-transparent outline-none text-morandi-foreground-light dark:text-morandi-foreground-dark placeholder:text-morandi-muted-light dark:placeholder:text-morandi-muted-dark" />
            </InfoRow>
             <InfoRow icon={<PhoneIcon className="w-5 h-5"/>}>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="電話" className="w-full bg-transparent outline-none text-morandi-foreground-light dark:text-morandi-foreground-dark placeholder:text-morandi-muted-light dark:placeholder:text-morandi-muted-dark" />
            </InfoRow>
            <InfoRow icon={<EmailIcon className="w-5 h-5"/>}>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="電子郵件" className="w-full bg-transparent outline-none text-morandi-foreground-light dark:text-morandi-foreground-dark placeholder:text-morandi-muted-light dark:placeholder:text-morandi-muted-dark" />
            </InfoRow>
            <InfoRow icon={<AddressIcon className="w-5 h-5"/>}>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="地址" className="w-full bg-transparent outline-none text-morandi-foreground-light dark:text-morandi-foreground-dark placeholder:text-morandi-muted-light dark:placeholder:text-morandi-muted-dark" />
            </InfoRow>
             <InfoRow icon={<WebsiteIcon className="w-5 h-5"/>}>
                <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="網站" className="w-full bg-transparent outline-none text-morandi-foreground-light dark:text-morandi-foreground-dark placeholder:text-morandi-muted-light dark:placeholder:text-morandi-muted-dark" />
            </InfoRow>
             <InfoRow icon={<SocialIcon className="w-5 h-5"/>}>
                <input type="text" name="social" value={formData.social} onChange={handleChange} placeholder="社群媒體" className="w-full bg-transparent outline-none text-morandi-foreground-light dark:text-morandi-foreground-dark placeholder:text-morandi-muted-light dark:placeholder:text-morandi-muted-dark" />
            </InfoRow>


          <div className="pt-6">
            <motion.button 
              type="submit" 
              className="w-full flex items-center justify-center gap-3 bg-morandi-accent-light dark:bg-morandi-accent-dark text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-morandi-accent-light/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!formData.name}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <SaveIcon className="w-5 h-5" />
              {isEditing ? '更新名片' : '儲存名片'}
            </motion.button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CardForm;