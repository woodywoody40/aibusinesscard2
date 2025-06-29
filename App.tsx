import React, { useState, useCallback, useRef } from 'react';
import { BusinessCard, AppView } from './types.ts';
import { useLocalStorage } from './hooks/useLocalStorage.ts';
import { extractInfoFromImage } from './services/geminiService.ts';
import CardList from './components/CardList.tsx';
import Scanner from './components/Scanner.tsx';
import CardForm from './components/CardForm.tsx';
import ApiKeySetup from './components/ApiKeySetup.tsx';
import { CameraIcon } from './components/icons/CameraIcon.tsx';
import { useTheme } from './hooks/useTheme.ts';
import ThemeToggle from './components/ThemeToggle.tsx';
import { LogoIcon } from './components/icons/LogoIcon.tsx';
import { SettingsIcon } from './components/icons/SettingsIcon.tsx';
import { AnimatePresence, motion, Transition } from 'framer-motion';
import { ExportIcon } from './components/icons/ExportIcon.tsx';
import { ImportIcon } from './components/icons/ImportIcon.tsx';
import { LogoutIcon } from './components/icons/LogoutIcon.tsx';


async function cropImage(imageUrl: string, box: { x: number; y: number; width: number; height: number; }): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();

    image.onload = () => {
      try {
        if (!context) {
          return reject(new Error("Could not get canvas context"));
        }
        
        const sourceWidth = image.width * box.width;
        const sourceHeight = image.height * box.height;
        
        const padding = Math.max(sourceWidth, sourceHeight) * 0.2;
        
        const sx = image.width * box.x - padding;
        const sy = image.height * box.y - padding;
        const sWidth = sourceWidth + padding * 2;
        const sHeight = sourceHeight + padding * 2;
        
        const finalX = Math.max(0, sx);
        const finalY = Math.max(0, sy);
        const finalWidth = Math.min(image.width - finalX, sWidth);
        const finalHeight = Math.min(image.height - finalY, sHeight);

        canvas.width = finalWidth;
        canvas.height = finalHeight;

        context.drawImage(
          image,
          finalX,
          finalY,
          finalWidth,
          finalHeight,
          0,
          0,
          finalWidth,
          finalHeight
        );

        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } catch (e) {
        reject(e);
      }
    };

    image.onerror = () => reject(new Error('Failed to load image for cropping'));
    image.src = imageUrl;
  });
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: '100vw',
    scale: 0.8
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: '-100vw',
    scale: 1.2
  }
};

const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

export default function App() {
  useTheme();
  const [apiKey, setApiKey] = useLocalStorage<string | null>('gemini-api-key', null);
  const [cards, setCards] = useLocalStorage<BusinessCard[]>('business-cards', []);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LIST);
  const [scannedData, setScannedData] = useState<Partial<BusinessCard>>({});
  const [editingCard, setEditingCard] = useState<BusinessCard | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScanComplete = useCallback(async (imageDataUrl: string) => {
    if (!apiKey) {
      setError("Please set your API key before scanning.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setCurrentView(AppView.FORM);
    
    const base64Image = imageDataUrl.split(',')[1];
    let finalImageDataUrl = imageDataUrl;

    try {
      const extractedData = await extractInfoFromImage(base64Image, apiKey);
      
      if (extractedData.photoBoundingBox) {
        try {
          finalImageDataUrl = await cropImage(imageDataUrl, extractedData.photoBoundingBox);
        } catch (cropError) {
          console.error("Failed to crop image, using full image as fallback.", cropError);
        }
      }

      setScannedData({
        ...extractedData,
        image: finalImageDataUrl,
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during analysis.";
      setError(errorMessage);
      setScannedData({ image: finalImageDataUrl });
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const handleSaveCard = (cardFormData: Omit<BusinessCard, 'id' | 'createdAt'>) => {
    if (editingCard) {
      // Update existing card
      const updatedCard = { ...editingCard, ...cardFormData };
      setCards(prevCards => prevCards.map(c => c.id === editingCard.id ? updatedCard : c));
    } else {
      // Create new card
      const newCard: BusinessCard = {
        id: `card_${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...cardFormData,
      };
      setCards(prevCards => [newCard, ...prevCards].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }

    handleNavigateToList();
  };

  const handleEditStart = (card: BusinessCard) => {
    setEditingCard(card);
    setScannedData(card);
    setCurrentView(AppView.FORM);
  };
  
  const handleDeleteCard = (id: string) => {
     if(window.confirm(`確定要刪除這張名片嗎？此操作無法復原。`)) {
        setCards(prevCards => prevCards.filter(card => card.id !== id));
     }
  };

  const handleNavigateToList = () => {
    setCurrentView(AppView.LIST);
    setScannedData({});
    setError(null);
    setEditingCard(null);
  };
  
  const handleExport = () => {
    if (cards.length === 0) {
      alert("您的名片冊是空的，沒有資料可以匯出。");
      return;
    }
    const dataStr = JSON.stringify(cards, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `ai-card-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsSettingsMenuOpen(false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
    setIsSettingsMenuOpen(false);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("File is not readable");
        }
        const importedCards: BusinessCard[] = JSON.parse(text);

        if (!Array.isArray(importedCards)) {
          throw new Error("Invalid format: Not an array.");
        }
        if (importedCards.length > 0 && (!importedCards[0].id || !importedCards[0].name)) {
          throw new Error("Invalid format: Missing required card properties.");
        }
        
        setCards(prevCards => {
          const cardMap = new Map<string, BusinessCard>();
          prevCards.forEach(card => cardMap.set(card.id, card));
          importedCards.forEach(card => cardMap.set(card.id, card));
          
          const mergedCards = Array.from(cardMap.values());
          mergedCards.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          return mergedCards;
        });

        alert(`成功匯入 ${importedCards.length} 筆名片資料！`);

      } catch (error) {
        console.error("Import failed:", error);
        alert(`匯入失敗：檔案格式不正確或已損毀。\n請確認您選擇的是先前從本應用程式匯出的 .json 備份檔。`);
      } finally {
        if (event.target) {
            event.target.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetApiKey = () => {
    if(window.confirm('您確定要重設 API Key 嗎？您將需要重新輸入金鑰才能使用 AI 掃描功能。')) {
      setApiKey(null);
      setIsSettingsMenuOpen(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.SCANNER:
        return (
          <motion.div key="scanner" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <Scanner onScanComplete={handleScanComplete} onCancel={handleNavigateToList} />
          </motion.div>
        );
      case AppView.FORM:
        return (
          <motion.div key="form" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <CardForm
              initialData={scannedData}
              onSave={handleSaveCard}
              onCancel={handleNavigateToList}
              isLoading={isLoading}
              error={error}
              onResetApiKey={handleResetApiKey}
            />
          </motion.div>
        );
      case AppView.LIST:
      default:
        return (
           <motion.div key="list" initial="initial" animate="in" exit="out" variants={{ ...pageVariants, initial: { opacity: 0, x: 0 }, out: { opacity: 0, x: 0 } }} transition={pageTransition}>
            <CardList cards={cards} onEdit={handleEditStart} onDelete={handleDeleteCard} />
          </motion.div>
        );
    }
  };

  if (!apiKey) {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-morandi-background-light text-morandi-foreground-light dark:bg-morandi-background-dark dark:text-morandi-foreground-dark transition-colors duration-500 p-4">
             <ApiKeySetup onSave={setApiKey} />
        </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-morandi-background-light text-morandi-foreground-light dark:bg-morandi-background-dark dark:text-morandi-foreground-dark transition-colors duration-500">
      <motion.div
        key="main-app"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-lg mx-auto flex-1 flex flex-col"
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
        <header className="w-full text-center py-4 px-4 sticky top-0 bg-morandi-background-light/80 dark:bg-morandi-background-dark/80 backdrop-blur-sm z-20 flex justify-between items-center">
          <div className="w-20"></div>
          <div className="flex items-center gap-2">
            <LogoIcon className="w-7 h-7" />
            <h1 className="text-2xl font-bold text-morandi-foreground-light dark:text-morandi-foreground-dark">
              Ai名片蒐集冊
            </h1>
          </div>
          <div className="w-20 flex justify-end items-center gap-2">
              <div className="relative">
                  <button onClick={() => setIsSettingsMenuOpen(o => !o)} title="設定" className="p-2 text-morandi-muted-light dark:text-morandi-muted-dark hover:text-morandi-accent-light dark:hover:text-morandi-accent-dark transition-colors">
                    <SettingsIcon className="w-6 h-6" />
                  </button>
                  <AnimatePresence>
                  {isSettingsMenuOpen && (
                      <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute right-0 mt-2 w-56 origin-top-right bg-morandi-card-light dark:bg-morandi-card-dark divide-y divide-morandi-background-light dark:divide-morandi-background-dark rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30"
                      >
                          <div className="py-1">
                              <button onClick={handleImportClick} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-morandi-foreground-light dark:text-morandi-foreground-dark hover:bg-morandi-background-light dark:hover:bg-morandi-background-dark transition-colors">
                                  <ImportIcon className="w-5 h-5"/>
                                  匯入名片資料...
                              </button>
                              <button onClick={handleExport} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-morandi-foreground-light dark:text-morandi-foreground-dark hover:bg-morandi-background-light dark:hover:bg-morandi-background-dark transition-colors">
                                  <ExportIcon className="w-5 h-5"/>
                                  匯出名片資料
                              </button>
                          </div>
                          <div className="py-1">
                                <button onClick={handleResetApiKey} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-morandi-foreground-light dark:text-morandi-foreground-dark hover:bg-morandi-background-light dark:hover:bg-morandi-background-dark transition-colors">
                                    <LogoutIcon className="w-5 h-5"/>
                                    重設 API Key
                                </button>
                          </div>
                      </motion.div>
                  )}
                  </AnimatePresence>
              </div>
              <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 w-full">
          <AnimatePresence mode="wait">
            {renderView()}
          </AnimatePresence>
        </main>
        {currentView === AppView.LIST && (
          <div className="sticky bottom-0 w-full flex justify-center p-4 bg-transparent">
             <motion.button
              onClick={() => setCurrentView(AppView.SCANNER)}
              className="flex items-center gap-3 bg-morandi-accent-light dark:bg-morandi-accent-dark text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-morandi-accent-light/30"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <CameraIcon className="w-6 h-6" />
              掃描新名片
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}