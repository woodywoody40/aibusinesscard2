# AI 名片蒐集冊

一款能使用相機掃描名片的應用程式，透過 Google Gemini AI 自動擷取姓名、電話、Email、公司和職稱等聯絡資訊。所有聯絡人都能集中管理、搜尋，並搭配了精美的 UI 和主題切換功能。

**[線上體驗連結](https://woodywoody40.github.io/aibusinesscard2/)**

---

### 主要功能

-   📸 **AI 智慧掃描:** 使用 **Google Gemini API** 精準地從名片圖片中擷取資訊。
-   👤 **自動頭像裁切:** 智慧偵測並裁切名片上的人像，作為乾淨的個人頭像。
-   📂 **完整資訊擷取:** 抓取姓名、公司、職稱、電話、Email、地址、網站和社群媒體連結。
-   🏷️ **智慧產業分類:** 以繁體中文自動將名片按產業分類 (例如：科技業、金融業)。
-   🔍 **互動式聯絡人列表:** 以精美的卡片檢視所有聯絡人，並可按產業分組，支援即時全文檢索。
-   🎨 **優雅且響應式的 UI:** 以優雅的「莫蘭迪」色系打造，在電腦和手機上都能完美呈現。
-   🌓 **深色/淺色模式:** 根據您的喜好切換主題，並有流暢的過場動畫。
-   📦 **資料可攜性:** 輕鬆匯入/匯出您的所有名片資料 (JSON 格式)，方便備份與遷移。
-   🔑 **使用者自帶金鑰 (BYOK):** 應用程式啟動時會引導您輸入自己的 Google Gemini API Key，金鑰只會儲存在您自己的瀏覽器中，確保安全與隱私。
-   ⚡ **支援 PWA:** 可安裝為漸進式網路應用程式 (PWA)，提供離線、如原生 App 般的體驗。
-   🛠️ **無需建置步驟:** 使用 ES Modules 直接在瀏覽器中運行，設定和修改都極為簡單。

### 應用程式截圖

| 淺色模式 | 深色模式 |
| :---: | :---: |
| *[淺色模式下的主列表截圖]* | *[深色模式下的主列表截圖]* |
| *[相機掃描介面截圖]* | *[AI 分析後的名片表單截圖]* |

---

### 技術棧 (Tech Stack)

-   **前端框架:** [React](https://reactjs.org/)
-   **程式語言:** [TypeScript](https://www.typescriptlang.org/)
-   **AI 模型:** [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash-preview-04-17`)
-   **樣式:** [Tailwind CSS](https://tailwindcss.com/)
-   **動畫效果:** [Framer Motion](https://www.framer.com/motion/)
-   **模組載入與轉譯:** 本專案利用原生 ES Modules 實現「無建置步驟」的開發體驗。使用 [esm.sh](https://esm.sh/) CDN 載入 React 等外部依賴，並透過 **Babel Standalone** 直接在瀏覽器中即時轉譯 JSX 和 TypeScript 程式碼，讓您修改後能立即看到結果。
-   **離線快取:** [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

### 開始使用 (Getting Started)

依照以下步驟在您的本機環境中設定並運行此專案。

#### 事前準備 (Prerequisites)

-   新版的網頁瀏覽器 (Chrome, Firefox, Safari, Edge)。
-   一個本地的網頁伺服器來提供靜態檔案服務。若您已安裝 [Node.js](https://nodejs.org/)，可使用 `npx` 快速啟動。
-   一個您自己的 Google Gemini API 金鑰。

#### 1. 取得 Google Gemini API 金鑰

此專案需要 Google Gemini API 金鑰來啟用 AI 掃描功能。

1.  前往 **[Google AI Studio](https://aistudio.google.com/app/apikey)**。
2.  點擊 **"Create API key in new project"**。
3.  複製產生的 API 金鑰並妥善保管。

#### 2. 安裝與設定

由於此專案無需建置步驟，設定過程非常簡單。

1.  **複製專案庫 (Clone the repository):**
    ```bash
    git clone https://github.com/woodywoody40/aibusinesscard2.git
    ```

2.  **進入專案目錄 (Navigate to the project directory):**
    ```bash
    cd aibusinesscard2
    ```
    
3.  **啟動本地伺服器 (Start a local web server):**
    最簡單的方式是使用 `npx`。此指令將會啟動一個伺服器並顯示本地網址。
    ```bash
    npx serve .
    ```

4.  **開啟應用程式並設定金鑰 (Launch the App & Set Up Key):**
    -   開啟您的瀏覽器，並前往伺服器提供的本地網址 (通常是 `http://localhost:3000`)。
    -   應用程式第一次啟動時，會出現一個設定畫面。
    -   將您在步驟 1 中取得的 Gemini API 金鑰貼入輸入框中，然後點擊「儲存並開始使用」。
    -   您的金鑰將被儲存在瀏覽器的 Local Storage 中，下次開啟時不需再輸入。

現在您可以開始掃描名片了！

---

### 如何操作

1.  **掃描:** 點擊 **`掃描新名片`** 按鈕來開啟相機。
2.  **拍攝:** 將名片對準掃描框後，按下拍攝按鈕。
3.  **檢視與編輯:** AI 會分析圖片並自動填寫表單。您可以檢視、修改或補充任何資訊。
4.  **儲存:** 點擊 **`儲存名片`** 將其加入您的蒐集冊。
5.  **瀏覽與搜尋:** 您儲存的名片會顯示在主畫面上，並按產業分組。可使用搜尋框即時尋找聯絡人。
6.  **管理:** 點擊任一名片可展開詳細資訊。可使用右上角的設定選單來匯入/匯出資料或重設您的 API Key。

---

### 授權條款 (License)

此專案採用 MIT 授權 - 詳情請見 [LICENSE.md](LICENSE.md) 檔案。