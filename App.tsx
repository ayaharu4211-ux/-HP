
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { INITIAL_DATA } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);
  const [password, setPassword] = useState('');
  const [history, setHistory] = useState<CompanyData[]>([]);
  const [isEditingImage, setIsEditingImage] = useState(false); 
  const [data, setData] = useState<CompanyData>(() => {
    const saved = localStorage.getItem('nexus_corp_data_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.companyName) return parsed;
        return INITIAL_DATA;
      } catch (e) {
        console.error("Data restoration failed, using initial data.", e);
        return INITIAL_DATA;
      }
    }
    return INITIAL_DATA;
  });

  const pushToHistory = useCallback((currentState: CompanyData) => {
    setHistory(prev => [JSON.parse(JSON.stringify(currentState)), ...prev].slice(0, 30));
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
      console.warn("LocalStorage limit reached. Trying to clear history and optimize.");
      setHistory([]);
      try {
        localStorage.setItem('nexus_corp_data_v1', JSON.stringify(data));
      } catch (e2) {
        console.error("Critical: Storage limit exceeded even without history.");
        if (isAdmin) {
          console.warn("画像の合計サイズがブラウザの限界(約5MB)を超えています。不要な画像を削除してください。");
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

  const compressImage = (base64Str: string, maxWidth = 1024, quality = 0.5): Promise<string> => {
    return new Promise((resolve) => {
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
    });
  };

  const removeItem = useCallback((path: string, index: number) => {
    if (!window.confirm('この項目を完全に削除しますか？')) return;
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

  const handleImport = (jsonStr: string) => {
    try {
      const importedData = JSON.parse(jsonStr);
      if (window.confirm('現在の内容をすべて上書きして復元しますか？')) {
        setData(importedData);
        setShowDataManager(false);
        alert('データを復元しました。');
      }
    } catch (e) {
      alert('データ形式が正しくありません。');
    }
  };

  const handleReset = () => {
    if (window.confirm('全てのデータを初期状態に戻しますか？（保存されている変更は消去されます）')) {
      localStorage.removeItem('nexus_corp_data_v1');
      setData(INITIAL_DATA);
      setShowDataManager(false);
      alert('初期化が完了しました。');
    }
  };

  const EditableText = ({ path, className, element = 'span', hideOnImageEdit = false }: any) => {
    const val = path.split('.').reduce((obj: any, key: any) => obj && obj[key], data);
    const Element = element as any;
    if (!isAdmin) return <Element className={className}>{val}</Element>;
    const isHidden = isEditingImage && hideOnImageEdit;
    const opacity = isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto';
    return (
      <Element 
        className={`${className} relative z-[90] ${opacity} transition-all hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400 cursor-text min-h-[1em] outline-none`}
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
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none bg-black/20">
            <div className="bg-white/90 text-slate-900 px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-2xl">画像を編集</div>
          </div>
        )}
        {showOptions && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl" onClick={closeOptions}>
            <div className="bg-white rounded-[2rem] p-10 max-w-sm w-full text-center space-y-6" onClick={e => e.stopPropagation()}>
               <h4 className="luxury-serif text-2xl text-slate-900">画像の変更</h4>
               <p className="text-[10px] text-slate-400">※スマホ表示最適化のため自動圧縮されます</p>
               <button onClick={() => fileInputRef.current?.click()} className="w-full bg-slate-900 text-white py-4 rounded-xl text-sm font-bold tracking-widest">PCからアップロード</button>
               <button onClick={() => { const url = prompt('画像URLを入力', src); if (url) { updateData(path, url); closeOptions(); } }} className="w-full bg-slate-100 text-slate-600 py-4 rounded-xl text-sm font-bold tracking-widest">URLで指定</button>
               <button onClick={closeOptions} className="w-full text-slate-400 text-xs font-bold uppercase tracking-widest pt-2">キャンセル</button>
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

  const renderContent = () => {
    switch (currentPage) {
      case 'about': return <AboutPage {...commonProps} />;
      case 'services': return <ServicesPage {...commonProps} navigate={navigate} />;
      case 'portfolio': return <PortfolioPage {...commonProps} />;
      case 'careers': return <CareerPage {...commonProps} navigate={navigate} />;
      case 'contact': return <ContactPage {...commonProps} />;
      default: return (
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
                  <button onClick={() => updateData('news', [{ id: Date.now().toString(), date: '2024.12.01', category: 'NEWS', title: '新規ニュースタイトル' }, ...data.news])} className="text-[10px] font-bold tracking-widest border border-slate-900 px-6 py-2 rounded-full hover:bg-slate-900 hover:text-white transition-all">+ NEWS ADD</button>
                )}
              </div>
              <div className="space-y-4">
                {data.news.map((item, idx) => (
                  <div key={item.id} className="py-8 px-6 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 hover:bg-white transition-all rounded-2xl group relative">
                    <div className="flex items-center gap-8 min-w-[200px] shrink-0">
                      <EditableText path={`news.${idx}.date`} className="text-slate-400 font-mono text-sm" />
                      <EditableText path={`news.${idx}.category`} className="text-[9px] font-bold tracking-widest px-3 py-1 bg-slate-900 text-white rounded" />
                    </div>
                    {/* 
                      編集欄とボタンが被らないよう、flex-1のコンテナに右パディングを入れるか、
                      ListControlsを並列のflex要素として配置します。
                    */}
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
      );
    }
  };

  return (
    <div className={`min-h-screen ${isAdmin ? 'pt-10' : ''}`}>
      {isAdmin && (
        <div className="fixed top-0 left-0 right-0 h-10 bg-slate-900 text-white flex justify-between items-center px-6 z-[2000] text-[9px] font-bold tracking-widest uppercase">
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            ADMIN ACTIVE | PASS: 6530
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setShowDataManager(true)} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors"><i className="fa-solid fa-database mr-2"></i>DATA</button>
            <button onClick={undo} disabled={history.length === 0} className="disabled:opacity-20 hover:text-blue-400 transition-colors">UNDO ({history.length})</button>
            <button onClick={() => setIsAdmin(false)} className="bg-red-500 px-4 py-1 rounded-full hover:bg-red-600 transition-colors">EXIT</button>
          </div>
        </div>
      )}
      <Navbar navigate={navigate} currentPath={currentPage} data={data} isAdmin={isAdmin} updateData={updateData} EditableImage={EditableImage} isEditingImage={isEditingImage} />
      <main className="relative z-10">{renderContent()}</main>
      <Footer onAdminClick={() => setShowLogin(true)} navigate={navigate} companyName={data.companyName} />
      {showLogin && (
        <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-[5000] backdrop-blur-xl p-6">
          <div className="bg-white p-12 rounded-[3rem] w-full max-w-md shadow-2xl text-center border border-white/10">
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
        <div className="fixed inset-0 bg-slate-950/95 z-[10000] flex items-center justify-center p-6 md:p-12 overflow-y-auto backdrop-blur-2xl">
          <div className="bg-white rounded-[3rem] w-full max-w-5xl shadow-2xl p-10 md:p-20 flex flex-col gap-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-4">Master Data Manager</p>
                <h3 className="luxury-serif text-4xl text-slate-900">サイトデータの管理</h3>
              </div>
              <button onClick={() => setShowDataManager(false)} className="text-slate-400 hover:text-slate-900 text-3xl transition-colors"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="font-bold text-lg text-slate-800 flex items-center gap-3"><i className="fa-solid fa-file-export text-blue-500"></i>書き出し（バックアップ）</h4>
                <div className="relative">
                  <textarea readOnly value={JSON.stringify(data, null, 2)} className="w-full h-64 bg-slate-50 rounded-2xl p-6 font-mono text-[10px] text-slate-500 overflow-auto resize-none focus:outline-none border border-slate-100" />
                  <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(data, null, 2)); alert('クリップボードにコピーしました！'); }} className="absolute top-4 right-4 bg-white shadow-lg px-4 py-2 rounded-full text-[10px] font-bold text-slate-900 hover:bg-slate-50 active:scale-95 transition-all">COPY CODE</button>
                </div>
                <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                   <p className="text-xs text-red-600 mb-4 font-bold">⚠️ トラブルシューティング</p>
                   <p className="text-[10px] text-red-500 leading-relaxed mb-4">スマホで容量エラーが出る場合、一度リセットして初期状態に戻すことができます。</p>
                   <button onClick={handleReset} className="text-[10px] font-bold bg-red-600 text-white px-6 py-3 rounded-xl uppercase hover:bg-red-700 transition-colors">サイトデータを初期化する</button>
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="font-bold text-lg text-slate-800 flex items-center gap-3"><i className="fa-solid fa-file-import text-green-500"></i>読み込み（データ復元）</h4>
                <textarea id="importField" placeholder="ここにJSONデータを貼り付けてください..." className="w-full h-80 bg-slate-50 rounded-2xl p-6 font-mono text-[10px] text-slate-500 border border-slate-100 resize-none focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                <button onClick={() => handleImport((document.getElementById('importField') as HTMLTextAreaElement).value)} className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl text-xs tracking-widest uppercase hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">データを読み込む</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
