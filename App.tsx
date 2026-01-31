
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceSection from './components/ServiceSection';
import Footer from './components/Footer';
import CareerPage from './pages/CareerPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import { PageId, CompanyData } from './types';
import { INITIAL_DATA, NAV_ITEMS } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);
  const [password, setPassword] = useState('');
  const [history, setHistory] = useState<CompanyData[]>([]);
  const [isEditingImage, setIsEditingImage] = useState(false); 
  const [storageUsage, setStorageUsage] = useState(0);

  const [data, setData] = useState<CompanyData>(() => {
    const saved = localStorage.getItem('nexus_corp_data_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.companyName) return parsed;
        return INITIAL_DATA;
      } catch (e) {
        return INITIAL_DATA;
      }
    }
    return INITIAL_DATA;
  });

  // constants.tsx の中身をまるごと生成する関数
  const generateFullFileContent = useCallback((currentData: CompanyData) => {
    const jsonStr = JSON.stringify(currentData, null, 2);
    const navItemsStr = JSON.stringify(NAV_ITEMS, null, 2);
    
    return `import { NavItem, CompanyData } from './types';

export const NAV_ITEMS: NavItem[] = ${navItemsStr};

export const INITIAL_DATA: CompanyData = ${jsonStr};`;
  }, []);

  const calculateStorage = useCallback(() => {
    const stringified = JSON.stringify(data);
    const sizeInBytes = new Blob([stringified]).size;
    const usagePercent = Math.min((sizeInBytes / (5 * 1024 * 1024)) * 100, 100);
    setStorageUsage(usagePercent);
  }, [data]);

  useEffect(() => {
    calculateStorage();
  }, [data, calculateStorage]);

  const pushToHistory = useCallback((currentState: CompanyData) => {
    setHistory(prev => [JSON.parse(JSON.stringify(currentState)), ...prev].slice(0, 10));
  }, []);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const [previousState, ...remainingHistory] = history;
    setData(previousState);
    setHistory(remainingHistory);
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('nexus_corp_data_v1', JSON.stringify(data));
    } catch (e) {
      setHistory([]);
      try {
        localStorage.setItem('nexus_corp_data_v1', JSON.stringify(data));
      } catch (e2) {
        if (isAdmin) {
          alert("【容量エラー】画像の合計サイズが大きすぎます。一括軽量化を試してください。");
        }
      }
    }
    document.title = `${data.companyName} | 公式サイト`;
  }, [data, isAdmin]);

  const updateData = useCallback((path: string, value: any) => {
    setData(prev => {
      pushToHistory(prev);
      const newData = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let target = newData;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!target[parts[i]]) target[parts[i]] = {};
        target = target[parts[i]];
      }
      target[parts[parts.length - 1]] = value;
      return newData;
    });
  }, [pushToHistory]);

  const compressImage = (base64Str: string, maxWidth = 800, quality = 0.3): Promise<string> => {
    return new Promise((resolve) => {
      if (!base64Str.startsWith('data:image')) return resolve(base64Str);
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(base64Str);
    });
  };

  const optimizeAllImages = async () => {
    if (!window.confirm("全画像を軽量化し、保存容量を確保します。よろしいですか？")) return;
    const recursiveOptimize = async (obj: any): Promise<any> => {
      if (typeof obj !== 'object' || obj === null) return obj;
      const newObj = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        let val = obj[key];
        if (typeof val === 'string' && val.startsWith('data:image')) {
          val = await compressImage(val, 800, 0.3);
        } else if (typeof val === 'object') {
          val = await recursiveOptimize(val);
        }
        newObj[key] = val;
      }
      return newObj;
    };
    const optimized = await recursiveOptimize(data);
    setData(optimized);
    alert("最適化が完了しました。");
  };

  const handleDownload = () => {
    const content = generateFullFileContent(data);
    const blob = new Blob([content], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `constants.tsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const removeItem = useCallback((path: string, index: number) => {
    if (!window.confirm('削除しますか？')) return;
    setData(prev => {
      pushToHistory(prev);
      const newData = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let target = newData;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!target[parts[i]]) return prev;
        target = target[parts[i]];
      }
      const arrayKey = parts[parts.length - 1];
      const targetArray = target[arrayKey];
      if (Array.isArray(targetArray)) {
        targetArray.splice(index, 1);
        return newData;
      }
      return prev;
    });
  }, [pushToHistory]);

  const moveItem = useCallback((path: string, index: number, direction: 'up' | 'down') => {
    setData(prev => {
      pushToHistory(prev);
      const newData = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let target = newData;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!target[parts[i]]) return prev;
        target = target[parts[i]];
      }
      const arrayKey = parts[parts.length - 1];
      const arr = target[arrayKey];
      if (Array.isArray(arr)) {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < arr.length) {
          const item = arr.splice(index, 1)[0];
          arr.splice(newIndex, 0, item);
          return newData;
        }
      }
      return prev;
    });
  }, [pushToHistory]);

  const navigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '6530') {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword('');
    } else {
      alert('パスワードが違います');
    }
  };

  const handleImport = (fullContent: string) => {
    try {
      // constants.tsx の形式から JSON 部分を抽出
      const jsonMatch = fullContent.match(/export const INITIAL_DATA: CompanyData = (\{[\s\S]*\});/);
      if (jsonMatch && jsonMatch[1]) {
        const importedData = JSON.parse(jsonMatch[1]);
        if (window.confirm('サイトデータを復元しますか？')) {
          setData(importedData);
          setShowDataManager(false);
          alert('復元完了しました。');
        }
      } else {
        // 純粋な JSON の場合も考慮
        const importedData = JSON.parse(fullContent);
        setData(importedData);
        setShowDataManager(false);
        alert('JSONデータを読み込みました。');
      }
    } catch (e) {
      alert('正しい形式のコードを貼り付けてください。');
    }
  };

  const handleReset = () => {
    if (window.confirm('初期状態に戻しますか？')) {
      localStorage.removeItem('nexus_corp_data_v1');
      setData(INITIAL_DATA);
      setShowDataManager(false);
      alert('初期化しました。');
    }
  };

  const EditableText = ({ path, className, element = 'span', hideOnImageEdit = false, style }: any) => {
    const val = path.split('.').reduce((obj: any, key: any) => obj && obj[key], data);
    const Element = element as any;
    if (!isAdmin) return <Element className={className} style={style}>{val}</Element>;
    const isHidden = isEditingImage && hideOnImageEdit;
    return (
      <Element 
        style={style}
        className={`${className} relative z-[90] ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} transition-all hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400 cursor-text min-h-[1em] outline-none`}
        contentEditable={!isHidden}
        suppressContentEditableWarning
        onBlur={(e: any) => {
          const newText = e.target.innerText;
          if (val !== newText) updateData(path, newText);
        }}
        onClick={(e: any) => e.stopPropagation()}
      >
        {val}
      </Element>
    );
  };

  const EditableImage = ({ path, className, alt }: any) => {
    const src = path.split('.').reduce((obj: any, key: any) => obj && obj[key], data);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showOptions, setShowOptions] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const compressed = await compressImage(reader.result as string);
          updateData(path, compressed); 
          closeOptions(); 
        };
        reader.readAsDataURL(file);
      }
    };

    const openOptions = (e: React.MouseEvent) => {
      if (!isAdmin) return;
      e.preventDefault();
      e.stopPropagation();
      setShowOptions(true);
      setIsEditingImage(true);
    };

    const closeOptions = () => { setShowOptions(false); setIsEditingImage(false); };

    if (!isAdmin) return <img src={src || 'https://via.placeholder.com/800x600'} alt={alt} className={className} />;

    return (
      <div className={`relative group/img w-full h-full cursor-pointer overflow-hidden ${showOptions ? 'z-[9999]' : 'z-10'}`} onClick={openOptions}>
        <img src={src || 'https://via.placeholder.com/800x600'} alt={alt} className={`${className} transition-all ${!showOptions ? 'group-hover/img:brightness-75' : ''}`} />
        {!showOptions && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none bg-black/20 text-white text-[10px] font-bold tracking-widest uppercase">編集</div>
        )}
        {showOptions && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl" onClick={closeOptions}>
            <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center space-y-4" onClick={e => e.stopPropagation()}>
               <h4 className="luxury-serif text-xl">画像の変更</h4>
               <button onClick={() => fileInputRef.current?.click()} className="w-full bg-slate-900 text-white py-4 rounded-xl text-xs font-bold tracking-widest uppercase">PC/スマホからアップロード</button>
               <button onClick={() => { const url = prompt('画像URLを入力', src); if (url) { updateData(path, url); closeOptions(); } }} className="w-full bg-slate-100 text-slate-600 py-4 rounded-xl text-xs font-bold tracking-widest uppercase">URLで指定</button>
               <button onClick={closeOptions} className="w-full text-slate-400 text-[10px] font-bold tracking-widest pt-2 uppercase">キャンセル</button>
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>
        )}
      </div>
    );
  };

  const ListControls = ({ path, index, listLength }: any) => {
    if (!isAdmin || isEditingImage) return null; 
    return (
      <div className="flex gap-1 p-1 bg-white/95 rounded-lg shadow-xl border border-slate-100 z-[100] relative" onClick={e => e.stopPropagation()}>
        <button onClick={() => moveItem(path, index, 'up')} disabled={index === 0} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-10"><i className="fa-solid fa-arrow-up text-[10px]"></i></button>
        <button onClick={() => moveItem(path, index, 'down')} disabled={index === listLength - 1} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-10"><i className="fa-solid fa-arrow-down text-[10px]"></i></button>
        <button onClick={() => removeItem(path, index)} className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600"><i className="fa-solid fa-trash text-[10px]"></i></button>
      </div>
    );
  };

  const commonProps = { data, isAdmin, updateData, EditableText, EditableImage, ListControls, isEditingImage };

  return (
    <div className={`min-h-screen ${isAdmin ? 'pt-10' : ''}`}>
      {isAdmin && (
        <div className="fixed top-0 left-0 right-0 h-10 bg-slate-900 text-white flex justify-between items-center px-6 z-[2000] text-[9px] font-bold tracking-widest uppercase">
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            編集モード実行中
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setShowDataManager(true)} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors flex items-center gap-2">
               <i className="fa-solid fa-code"></i> コード書き出し
               {storageUsage > 80 && <i className="fa-solid fa-warning text-yellow-400"></i>}
            </button>
            <button onClick={undo} disabled={history.length === 0} className="disabled:opacity-20 hover:text-blue-400 transition-colors">元に戻す ({history.length})</button>
            <button onClick={() => setIsAdmin(false)} className="bg-red-500 px-4 py-1 rounded-full hover:bg-red-600 transition-colors">終了</button>
          </div>
        </div>
      )}
      <Navbar navigate={navigate} currentPath={currentPage} data={data} isAdmin={isAdmin} updateData={updateData} EditableImage={EditableImage} isEditingImage={isEditingImage} />
      <main className="relative z-10">
        {currentPage === 'home' ? (
          <>
            <Hero {...commonProps} navigate={navigate} />
            <ServiceSection {...commonProps} navigate={navigate} />
            <section className="py-24 bg-slate-50">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-16 border-b border-slate-200 pb-10">
                  <div>
                    <EditableText path="newsLabels.title" className="luxury-serif text-4xl text-slate-900 block mb-2" element="h2" />
                    <EditableText path="newsLabels.sub" className="text-slate-400 text-[10px] tracking-[0.4em] font-bold uppercase block" />
                  </div>
                  {isAdmin && !isEditingImage && (
                    <button onClick={() => updateData('news', [{ id: Date.now().toString(), date: '2024.12.01', category: 'NEWS', title: '新規ニュースタイトル' }, ...data.news])} className="text-[10px] font-bold tracking-widest border border-slate-900 px-6 py-2 rounded-full hover:bg-slate-900 hover:text-white transition-all">+ ニュース追加</button>
                  )}
                </div>
                <div className="space-y-4">
                  {data.news.map((item, idx) => (
                    <div key={item.id} className="py-8 px-6 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 hover:bg-white transition-all rounded-2xl group relative">
                      <div className="flex items-center gap-8 min-w-[200px] shrink-0">
                        <EditableText path={`news.${idx}.date`} className="text-slate-400 font-mono text-sm" />
                        <EditableText path={`news.${idx}.category`} className="text-[9px] font-bold tracking-widest px-3 py-1 bg-slate-900 text-white rounded" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <EditableText path={`news.${idx}.title`} className="text-slate-800 text-lg font-medium block" />
                      </div>
                      {isAdmin && (
                        <div className="md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <ListControls path="news" index={idx} listLength={data.news.length} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          {
            'about': <AboutPage {...commonProps} />,
            'services': <ServicesPage {...commonProps} navigate={navigate} />,
            'portfolio': <PortfolioPage {...commonProps} />,
            'careers': <CareerPage {...commonProps} navigate={navigate} />,
            'contact': <ContactPage {...commonProps} />
          }[currentPage]
        )}
      </main>
      <Footer onAdminClick={() => setShowLogin(true)} navigate={navigate} companyName={data.companyName} />
      
      {showLogin && (
        <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-[5000] backdrop-blur-xl p-6">
          <div className="bg-white p-12 rounded-[3rem] w-full max-w-md shadow-2xl text-center">
            <h3 className="luxury-serif text-3xl mb-10 text-slate-900">管理者認証</h3>
            <form onSubmit={handleLogin} className="space-y-8">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 text-center text-2xl tracking-[0.5em] focus:ring-2 focus:ring-slate-900 transition-all outline-none" placeholder="••••" autoFocus />
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl text-xs tracking-widest uppercase hover:scale-[1.02] transition-all">ログイン</button>
              <button type="button" onClick={() => setShowLogin(false)} className="w-full text-slate-400 text-[10px] font-bold tracking-widest uppercase pt-4">キャンセル</button>
            </form>
          </div>
        </div>
      )}

      {showDataManager && (
        <div className="fixed inset-0 bg-slate-950/95 z-[10000] flex items-center justify-center p-4 md:p-12 overflow-y-auto backdrop-blur-2xl">
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-6xl shadow-2xl p-6 md:p-16 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">constants.tsx generator</p>
                <h3 className="luxury-serif text-2xl md:text-4xl text-slate-900">更新用コードの生成</h3>
                <div className="mt-4 flex items-center gap-4">
                   <div className="flex-1 max-w-[200px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${storageUsage > 80 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${storageUsage}%` }}></div>
                   </div>
                   <span className="text-[10px] font-bold text-slate-500">容量: {Math.round(storageUsage)}%</span>
                </div>
              </div>
              <button onClick={() => setShowDataManager(false)} className="text-slate-400 hover:text-slate-900 text-3xl transition-colors"><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest"><i className="fa-solid fa-file-code mr-2"></i>constants.tsx の内容すべて</span>
                  <button 
                    onClick={() => {
                      const content = generateFullFileContent(data);
                      navigator.clipboard.writeText(content);
                      alert('ファイル内容をすべてコピーしました！ constants.tsx に貼り付けてください。');
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
                  >全選択コピー</button>
                </div>
                <textarea 
                  readOnly 
                  value={generateFullFileContent(data)} 
                  className="w-full h-[400px] md:h-[500px] bg-slate-900 text-slate-300 rounded-2xl p-6 font-mono text-[9px] md:text-[11px] leading-relaxed resize-none focus:outline-none border border-slate-800" 
                />
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                   <h4 className="text-xs font-bold text-slate-900 uppercase">1. ファイルを保存する</h4>
                   <p className="text-[10px] text-slate-500 leading-relaxed">編集後の `constants.tsx` を直接ダウンロードして、プロジェクトのファイルを差し替えます。</p>
                   <button onClick={handleDownload} className="w-full bg-slate-900 text-white py-4 rounded-xl text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                     <i className="fa-solid fa-download"></i> constants.tsx を保存
                   </button>
                </div>

                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 space-y-4">
                   <h4 className="text-xs font-bold text-blue-900 uppercase">2. 画像を最適化する</h4>
                   <p className="text-[10px] text-blue-600 leading-relaxed">コードが長すぎてコピーできない場合は、まず全画像をさらに軽量化してください。</p>
                   <button onClick={optimizeAllImages} className="w-full bg-blue-600 text-white py-4 rounded-xl text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                     <i className="fa-solid fa-wand-magic-sparkles"></i> 画像を一括軽量化
                   </button>
                </div>

                <div className="p-6 bg-red-50 rounded-2xl border border-red-100 space-y-4">
                   <h4 className="text-xs font-bold text-red-900 uppercase">3. データを復元する</h4>
                   <p className="text-[10px] text-red-600 leading-relaxed">以前保存したコードを下に貼り付けて「復元」ボタンを押してください。</p>
                   <textarea id="importField" placeholder="ここに constants.tsx の内容を貼り付け..." className="w-full h-32 bg-white rounded-xl p-3 text-[10px] border border-red-100 outline-none" />
                   <button onClick={() => handleImport((document.getElementById('importField') as HTMLTextAreaElement).value)} className="w-full bg-red-500 text-white py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase">データを復元する</button>
                </div>
              </div>
            </div>
            
            <div className="text-center">
               <button onClick={handleReset} className="text-[9px] font-bold text-slate-300 hover:text-red-400 underline uppercase tracking-widest transition-colors">すべての変更を破棄して初期化する</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
