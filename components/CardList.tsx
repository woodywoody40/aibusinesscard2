import React, { useState, useMemo } from 'react';
import type { BusinessCard } from '../types.ts';
import { PhoneIcon } from './icons/PhoneIcon.tsx';
import { EmailIcon } from './icons/EmailIcon.tsx';
import { CompanyIcon } from './icons/CompanyIcon.tsx';
import { TitleIcon } from './icons/TitleIcon.tsx';
import { SearchIcon } from './icons/SearchIcon.tsx';
import { AddressIcon } from './icons/AddressIcon.tsx';
import { WebsiteIcon } from './icons/WebsiteIcon.tsx';
import { SocialIcon } from './icons/SocialIcon.tsx';
import { EditIcon } from './icons/EditIcon.tsx';
import { TrashIcon } from './icons/TrashIcon.tsx';
import { ChevronDownIcon } from './icons/ChevronDownIcon.tsx';
import { motion, AnimatePresence } from 'framer-motion';

const InfoRow: React.FC<{ icon: React.ReactNode; children: React.ReactNode; href?: string }> = ({ icon, children, href }) => {
    const ensureProtocol = (url: string) => {
        if (!url || url.startsWith('http://') || url.startsWith('https') || url.startsWith('mailto:') || url.startsWith('tel:')) {
            return url;
        }
        return `https://${url}`;
    };
    const finalHref = href ? ensureProtocol(href) : undefined;

    return (
        <div className="flex items-center gap-3">
            <span className="text-morandi-accent-light dark:text-morandi-accent-dark">{icon}</span>
            {finalHref ? (
                <a href={finalHref} target="_blank" rel="noopener noreferrer" className="text-morandi-foreground-light dark:text-morandi-foreground-dark hover:text-morandi-accent-light dark:hover:text-morandi-accent-dark transition-colors break-all">{children}</a>
            ) : (
                <span className="text-morandi-foreground-light dark:text-morandi-foreground-dark break-all">{children}</span>
            )}
        </div>
    );
};

const CardItem: React.FC<{
  card: BusinessCard;
  onEdit: (card: BusinessCard) => void;
  onDelete: (id: string) => void;
}> = ({ card, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-morandi-card-light dark:bg-morandi-card-dark rounded-2xl shadow-sm overflow-hidden transition-all duration-300 w-full cursor-pointer hover:shadow-md"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          <img src={card.image} alt={`${card.name} 的名片`} className="w-16 h-16 object-cover rounded-full border-2 border-morandi-background-light dark:border-morandi-muted-dark"/>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-morandi-foreground-light dark:text-morandi-foreground-dark truncate">{card.name}</h3>
            <p className="text-sm text-morandi-muted-light dark:text-morandi-muted-dark truncate">{card.company}</p>
          </div>
          <motion.div 
            className="text-morandi-muted-light dark:text-morandi-muted-dark"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon className="w-6 h-6" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 pb-4 border-t border-morandi-background-light dark:border-morandi-background-dark">
            <div className="mt-4 space-y-3">
              <InfoRow icon={<TitleIcon className="w-5 h-5"/>}>{card.title || 'N/A'}</InfoRow>
              <InfoRow icon={<PhoneIcon className="w-5 h-5"/>} href={`tel:${card.phone}`}>{card.phone || 'N/A'}</InfoRow>
              <InfoRow icon={<EmailIcon className="w-5 h-5"/>} href={`mailto:${card.email}`}>{card.email || 'N/A'}</InfoRow>
              <InfoRow icon={<AddressIcon className="w-5 h-5"/>}>{card.address || 'N/A'}</InfoRow>
              <InfoRow icon={<WebsiteIcon className="w-5 h-5"/>} href={card.website}>{card.website || 'N/A'}</InfoRow>
              <InfoRow icon={<SocialIcon className="w-5 h-5"/>} href={card.social}>{card.social || 'N/A'}</InfoRow>
            </div>
            
            <div className="mt-4 pt-4 border-t border-morandi-background-light dark:border-morandi-background-dark flex justify-end gap-2">
                <motion.button 
                  onClick={() => onEdit(card)} 
                  className="p-2 rounded-full text-morandi-muted-light dark:text-morandi-muted-dark hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  aria-label={`編輯 ${card.name}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <EditIcon className="w-5 h-5" />
                </motion.button>
                <motion.button 
                  onClick={() => onDelete(card.id)}
                  className="p-2 rounded-full text-morandi-muted-light dark:text-morandi-muted-dark hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  aria-label={`刪除 ${card.name}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <TrashIcon className="w-5 h-5" />
                </motion.button>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};


interface CardListProps {
  cards: BusinessCard[];
  onEdit: (card: BusinessCard) => void;
  onDelete: (id: string) => void;
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};

const CardList: React.FC<CardListProps> = ({ cards, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCards = useMemo(() => {
    if (!searchTerm) return cards;
    const lowercasedFilter = searchTerm.toLowerCase();
    return cards.filter(card =>
      Object.values(card).some(value => 
        typeof value === 'string' && value.toLowerCase().includes(lowercasedFilter)
      )
    );
  }, [cards, searchTerm]);

  const groupedCards = useMemo(() => {
    return filteredCards.reduce((acc, card) => {
      const industry = card.industry || '一般';
      if (!acc[industry]) {
        acc[industry] = [];
      }
      acc[industry].push(card);
      return acc;
    }, {} as Record<string, BusinessCard[]>);
  }, [filteredCards]);

  const sortedIndustries = useMemo(() => Object.keys(groupedCards).sort((a,b) => a === '一般' ? 1 : b === '一般' ? -1 : a.localeCompare(b,'zh-Hant')), [groupedCards]);
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="搜尋所有欄位..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-morandi-card-light dark:bg-morandi-card-dark border-2 border-transparent rounded-full py-2.5 pl-12 pr-4 text-morandi-foreground-light dark:text-morandi-foreground-dark placeholder-morandi-muted-light dark:placeholder-morandi-muted-dark focus:outline-none focus:ring-2 focus:ring-morandi-accent-light dark:focus:ring-morandi-accent-dark focus:border-transparent transition-all"
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="w-5 h-5 text-morandi-muted-light dark:text-morandi-muted-dark" />
        </div>
      </div>

      <AnimatePresence>
        {cards.length === 0 ? (
          <motion.div key="empty" initial={{opacity:0, y: 20}} animate={{opacity:1, y: 0}} className="text-center text-morandi-muted-light dark:text-morandi-muted-dark mt-10">
              <p className="text-lg">您的名片冊是空的</p>
              <p className="mt-2">點擊下方的「掃描新名片」開始吧！</p>
          </motion.div>
        ) : filteredCards.length === 0 ? (
          <motion.div key="no-results" initial={{opacity:0, y: 20}} animate={{opacity:1, y: 0}} className="text-center text-morandi-muted-light dark:text-morandi-muted-dark mt-10">
              <p>找不到符合搜尋條件的名片。</p>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 flex-1 pb-24"
          >
            {sortedIndustries.map(industry => (
              <div key={industry} className="space-y-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-morandi-muted-light dark:text-morandi-muted-dark px-2">{industry}</h2>
                <div className="space-y-4">
                  <AnimatePresence>
                    {groupedCards[industry].map(card => (
                       <motion.div
                          key={card.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                       >
                         <CardItem 
                            card={card}
                            onEdit={onEdit}
                            onDelete={onDelete}
                         />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardList;