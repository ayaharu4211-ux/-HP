
import React from 'react';

const CareerPage = ({ data, isAdmin, updateData, EditableText, EditableImage, ListControls, navigate }: any) => {
  return (
    <div className="pt-24 md:pt-48 pb-32 bg-white text-left">
      <div className="max-w-7xl mx-auto px-6">
        {/* メインビジュアルセクション - 明るさを110%に引き上げ */}
        <div className="relative rounded-[2rem] md:rounded-[4rem] overflow-hidden aspect-[16/9] md:aspect-[21/9] mb-12 md:mb-32 corporate-shadow bg-slate-50">
          <EditableImage 
            path="careers.bgImage" 
            className="w-full h-full object-cover brightness-[1.1] contrast-[1.05] saturate-[1.1] transition-all duration-700" 
            alt="Culture" 
          />
          
          {/* テキストレイヤー: 白文字に黒い枠（アウトライン）と強力なシャドウを適用 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
             <div className="pointer-events-auto">
               <EditableText 
                 path="careers.title" 
                 className="luxury-serif text-3xl sm:text-5xl md:text-8xl text-white block text-center [text-shadow:_1px_1px_0_#000,_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_0_10px_30px_rgba(0,0,0,0.8)]" 
                 element="h2" 
               />
             </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-16 md:mb-32 text-center">
          <EditableText path="careers.description" className="text-slate-500 leading-relaxed text-sm md:text-xl font-light block text-center" element="p" />
        </div>

        <div className="mb-10 md:mb-20 flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-100 pb-8 md:pb-12 gap-6">
          <div className="text-left">
            <EditableText path="careers.sectionTitle" className="luxury-serif text-2xl md:text-3xl text-slate-900 mb-2 block" element="h3" />
            <EditableText path="careers.sectionSub" className="text-slate-400 text-[8px] md:text-[10px] tracking-[0.3em] font-bold uppercase block" element="p" />
          </div>
          {isAdmin && (
            <button 
              onClick={() => updateData('careers.jobs', [...data.careers.jobs, { id: 'j'+Date.now(), title: '新規募集', dept: '部署名', location: '勤務地', salary: '年俸 000万円' }])}
              className="bg-slate-900 text-white px-6 md:px-8 py-2 md:py-3 rounded-full text-[8px] md:text-[10px] font-bold tracking-widest whitespace-nowrap self-start sm:self-auto hover:bg-slate-800 transition-colors"
            >+ 募集追加</button>
          )}
        </div>

        <div className="space-y-6 md:space-y-8">
          {data.careers.jobs.map((job: any, idx: number) => (
            <div key={job.id} className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 bg-slate-50 rounded-[2rem] md:rounded-[3rem] hover:bg-slate-100 transition-all group relative border border-transparent hover:border-slate-200">
              <div className="flex-1 mb-8 md:mb-0 text-left w-full">
                <div className="flex items-center gap-4 md:gap-6 mb-4 overflow-hidden">
                  <EditableText path={`careers.jobs.${idx}.dept`} className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 whitespace-nowrap" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200 flex-shrink-0"></span>
                  <EditableText path={`careers.jobs.${idx}.location`} className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 whitespace-nowrap" />
                </div>
                <EditableText path={`careers.jobs.${idx}.title`} className="luxury-serif text-xl md:text-3xl text-slate-900 block" element="h4" />
                <div className="mt-6 md:mt-8 flex items-center gap-3 md:gap-4">
                  <span className="text-[7px] md:text-[8px] tracking-widest text-slate-400 font-bold uppercase border border-slate-200 px-2 py-1 rounded">給与目安</span>
                  <EditableText path={`careers.jobs.${idx}.salary`} className="text-xs md:text-sm font-medium text-slate-600 block" />
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
                <div className="md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <ListControls path="careers.jobs" index={idx} listLength={data.careers.jobs.length} />
                </div>
                <button 
                  onClick={() => navigate('contact')}
                  className="w-full md:w-auto px-8 md:px-10 py-3 md:py-4 bg-slate-900 text-white rounded-full text-[9px] md:text-[11px] font-bold tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                >
                   <EditableText path="careers.applyBtn" className="inline-block" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerPage;
