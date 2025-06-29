import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogoIcon } from './icons/LogoIcon.tsx';
import ThemeToggle from './ThemeToggle.tsx';
import { SaveIcon } from './icons/SaveIcon.tsx';

interface ApiKeySetupProps {
  onSave: (apiKey: string) => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!apiKey.trim()) {
      setError("API Key 不能為空");
      return;
    }
    onSave(apiKey.trim());
  };
  
  return (
    <div className="w-full max-w-md">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <LogoIcon className="w-9 h-9" />
          <h1 className="text-3xl font-bold text-morandi-foreground-light dark:text-morandi-foreground-dark">
            Ai名片蒐集冊
          </h1>
        </div>
        <ThemeToggle />
      </header>
      <div className="bg-morandi-card-light dark:bg-morandi-card-dark p-8 rounded-2xl shadow-lg w-full">
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
        >
            <h2 className="text-2xl font-bold text-center mb-2 text-morandi-foreground-light dark:text-morandi-foreground-dark">
              初始設定
            </h2>
            <p className="text-center text-sm mb-4 text-morandi-muted-light dark:text-morandi-muted-dark">
                請輸入您的 Google Gemini API Key 以啟用 AI 掃描功能。您的金鑰將只會儲存在此瀏覽器中，不會上傳到任何地方。
            </p>
            {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}
            <div className="flex flex-col">
              <label className="text-sm mb-1 text-morandi-muted-light dark:text-morandi-muted-dark">Google Gemini API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-morandi-background-light dark:bg-morandi-background-dark border-2 border-transparent rounded-lg py-2 px-3 text-morandi-foreground-light dark:text-morandi-foreground-dark placeholder-morandi-muted-light dark:placeholder-morandi-muted-dark focus:outline-none focus:ring-2 focus:ring-morandi-accent-light dark:focus:ring-morandi-accent-dark transition-all"
                placeholder="在此貼上您的 API Key"
              />
            </div>
            <motion.button
              type="submit"
              className="w-full mt-4 flex items-center justify-center gap-3 bg-morandi-accent-light dark:bg-morandi-accent-dark text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-morandi-accent-light/30 transition-all duration-300 disabled:opacity-50"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              disabled={!apiKey.trim()}
            >
              <SaveIcon className="w-5 h-5"/>
              儲存並開始使用
            </motion.button>
             <p className="text-center text-xs mt-4 text-morandi-muted-light dark:text-morandi-muted-dark">
                沒有 API Key 嗎？您可以從 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="font-semibold text-morandi-accent-light dark:text-morandi-accent-dark hover:underline">Google AI Studio</a> 免費獲取。
            </p>
          </motion.form>
      </div>
    </div>
  );
};

export default ApiKeySetup;