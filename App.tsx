
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

  const generateFullFileContent = useCallback((currentData: CompanyData) => {
    const jsonStr = JSON.stringify(currentData, null, 2);
    const navItemsStr = JSON.stringify(NAV_ITEMS, null, 2);
    
    return `import { NavItem, CompanyData } from './types';

export const NAV_ITEMS: NavItem[] = ${navItemsStr};

export const INITIAL_DATA: CompanyData = ${jsonStr};
`;
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
          alert("【容量エラー】画像のデータが大きすぎて保存できません。画像を軽量化するか、外部URLを使用してください。");
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
    if (!window.confirm("全ての画像を軽量化（JPEG圧縮）してデータ量を削減します。よろしいですか？")) return;
    const recursiveOptimize = async (obj: any): Promise<any> => {
      if (typeof obj !== 'object' || obj === null) return obj;
      const newObj = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        let val = obj[key];
        if (typeof val === 'string' && val.startsWith('data:image')) {
          // すべてを一括軽量化する際は、最小限のサイズに絞る
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
    alert("全ての画像を最適化しました。");
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
      const jsonMatch = fullContent.match(/export const INITIAL_DATA: CompanyData = (\{[\s\S]*\});/);
      if (jsonMatch && jsonMatch[1]) {
        const importedData = JSON.parse(jsonMatch[1]);
        if (window.confirm('サイトデータを復元しますか？')) {
          setData(importedData);
          setShowDataManager(false);
          alert('復元が完了しました。');
        }
      } else {
        const importedData = JSON.parse(fullContent);
        setData(importedData);
        setShowDataManager(false);
        alert('データを読み込みました。');
      }
    } catch (e) {
      alert('コードの形式が正しくありません。');
    }
  };

  const EditableText = ({ path, className, element = 'span', hideOnImageEdit = false, style }: any) => {
    const val = path.split('.').reduce((obj: any, key: any) => obj && obj[key], data);
    const Element = element as any;
    if (!isAdmin) return val ? <Element className={className} style={style}>{val}</Element> : null;
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

  const EditableImage = ({ path, className, alt, maxWidth = 800, quality = 0.3 }: any) => {
    const src = path.split('.').reduce((obj: any, key: any) => obj && obj[key], data);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showOptions, setShowOptions] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const compressed = await compressImage(reader.result as string, maxWidth, quality);
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
               <p className="text-[10px] text-slate-400">{maxWidth}px / 画質 {quality} で保存されます</p>
               <button onClick={() => fileInputRef.current?.click()} className="w-full bg-slate-900 text-white py-4 rounded-xl text-xs font-bold tracking-widest uppercase">アップロード</button>
               <button onClick={() => { const url = prompt('画像URLを入力', src); if (url) { updateData(path, url); closeOptions(); } }} className="w-full bg-slate-100 text-slate-600 py-4 rounded-xl text-xs font-bold tracking-widest uppercase">URLで指定 (推奨)</button>
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
        <button onClick={() => { if(window.confirm('削除しますか？')) updateData(path, (path.split('.').reduce((o:any,i:any)=>o[i],data) as any[]).filter((_,id)=>id!==index)) }} className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600"><i className="fa-solid fa-trash text-[10px]"></i></button>
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
            EDIT MODE
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setShowDataManager(true)} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded flex items-center gap-2">
               <i className="fa-solid fa-file-code"></i> 完コピ書き出し
            </button>
            <button onClick={undo} disabled={history.length === 0} className="disabled:opacity-20">UNDO</button>
            <button onClick={() => setIsAdmin(false)} className="bg-red-500 px-4 py-1 rounded-full">EXIT</button>
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
        <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-[5000] p-6">
          <div className="bg-white p-12 rounded-[3rem] w-full max-w-md shadow-2xl text-center">
            <h3 className="luxury-serif text-3xl mb-10">管理者認証</h3>
            <form onSubmit={handleLogin} className="space-y-8">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 text-center text-2xl tracking-[0.5em] outline-none" placeholder="••••" autoFocus />
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl">ログイン</button>
            </form>
          </div>
        </div>
      )}

      {showDataManager && (
        <div className="fixed inset-0 bg-slate-950/95 z-[10000] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] w-full max-w-6xl p-6 md:p-12 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="luxury-serif text-3xl">constants.tsx 完全書き出し</h3>
              <button onClick={() => setShowDataManager(false)} className="text-slate-400 text-3xl"><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-4">
               <i className="fa-solid fa-circle-info text-blue-500 mt-1"></i>
               <div className="text-[11px] text-blue-800 leading-relaxed">
                  <p className="font-bold mb-1">【画質に関するお知らせ】</p>
                  <p>ヒーロー画像と採用情報の背景は、高品質（1920px）で保存されるよう設定されています。そのためファイルサイズが大きくなりやすいので、不要な場合は「一括軽量化」で全画像を最小限に抑えられます。</p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">constants.tsx のファイル内容すべて</span>
                  <button onClick={() => { navigator.clipboard.writeText(generateFullFileContent(data)); alert('constants.tsx の中身をすべてコピーしました！'); }} className="bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase">全選択コピー</button>
                </div>
                <textarea readOnly value={generateFullFileContent(data)} className="w-full h-[400px] bg-slate-900 text-slate-300 rounded-xl p-4 font-mono text-[10px] resize-none border border-slate-800" />
              </div>

              <div className="space-y-4">
                 <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                   <h4 className="text-[10px] font-bold uppercase text-slate-500">アクション</h4>
                   <button onClick={handleDownload} className="w-full bg-slate-900 text-white py-4 rounded-xl text-[10px] font-bold uppercase flex items-center justify-center gap-2">
                     <i className="fa-solid fa-download"></i> ファイルとして保存
                   </button>
                   <button onClick={optimizeAllImages} className="w-full bg-blue-600 text-white py-4 rounded-xl text-[10px] font-bold uppercase flex items-center justify-center gap-2">
                     <i className="fa-solid fa-wand-magic-sparkles"></i> 全画像を一括軽量化
                   </button>
                 </div>
                 <div className="p-4 border border-slate-100 rounded-xl">
                    <p className="text-[10px] text-slate-400 mb-2 uppercase tracking-widest">容量使用率 ({Math.round(storageUsage)}%)</p>
                    <div className="w-full h-1 bg-slate-100 rounded-full"><div className="h-full bg-blue-600" style={{width: `${storageUsage}%`}}></div></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
