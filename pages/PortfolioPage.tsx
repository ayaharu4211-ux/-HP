
import React from 'react';

const PortfolioPage = ({ data, isAdmin, updateData, EditableText, EditableImage, ListControls }: any) => {
  return (
    <div className="pt-48 pb-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-left">
        <div className="mb-32 flex justify-between items-end border-b border-slate-100 pb-12">
          <div>
            <EditableText path="portfolioLabels.title" className="luxury-serif text-5xl text-slate-900 mb-4 block" element="h2" />
            <EditableText path="portfolioLabels.sub" className="text-slate-400 text-xs tracking-[0.3em] font-bold uppercase block" element="p" />
          </div>
          {isAdmin && (
            <button 
              onClick={() => updateData('portfolio', [...data.portfolio, { id: 'p'+Date.now(), title: '新規実績タイトル', category: 'カテゴリー', client: 'クライアント名', image: '', description: '実績の概要説明文がここに入ります。' }])}
              className="bg-slate-900 text-white px-8 py-3 rounded-full text-[10px] font-bold tracking-widest"
            >+ 実績を追加</button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-32">
          {data.portfolio.map((item: any, idx: number) => (
            <div key={item.id} className="group relative flex flex-col">
              <div className="absolute -top-8 right-0 z-50">
                <ListControls path="portfolio" index={idx} listLength={data.portfolio.length} />
              </div>
              
              <div className="relative rounded-[3rem] overflow-hidden corporate-shadow aspect-[16/10] mb-10">
                <EditableImage path={`portfolio.${idx}.image`} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" alt={item.title} />
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <EditableText path={`portfolio.${idx}.category`} className="text-[10px] font-bold tracking-widest px-3 py-1 bg-slate-900 text-white rounded" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                  <EditableText path={`portfolio.${idx}.client`} className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400" />
                </div>
                <EditableText path={`portfolio.${idx}.title`} className="luxury-serif text-3xl text-slate-900 block" element="h4" />
                <EditableText path={`portfolio.${idx}.description`} className="text-slate-500 leading-relaxed text-lg font-light block" element="p" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
