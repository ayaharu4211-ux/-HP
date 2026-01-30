
import React from 'react';

const AboutPage = ({ data, isAdmin, updateData, EditableText, EditableImage, ListControls }: any) => {
  return (
    <div className="pt-64 pb-32 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-32">
          <EditableText path="about.title" className="luxury-serif text-5xl text-slate-900 mb-6 block text-center" element="h2" />
          <EditableText path="about.description" className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto block text-center" element="p" />
        </div>

        <div className="bg-slate-50 rounded-[3rem] p-12 md:p-20 corporate-shadow">
          <div className="flex justify-between items-center mb-12">
             <EditableText path="about.sectionTitle" className="luxury-serif text-2xl font-bold block" element="h3" />
             {isAdmin && (
               <button 
                onClick={() => updateData('about.items', [...data.about.items, { id: 'p'+Date.now(), label: '新規項目', value: '内容を入力' }])}
                className="text-[10px] font-bold tracking-widest text-slate-900 border border-slate-900 px-4 py-1.5 rounded-full"
               >+ 項目追加</button>
             )}
          </div>
          
          <div className="space-y-12">
            {data.about.items.map((item: any, idx: number) => (
              <div key={item.id} className="flex flex-col md:flex-row border-b border-slate-200 pb-8 last:border-none relative group">
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <EditableText path={`about.items.${idx}.label`} className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 block text-left" />
                </div>
                <div className="w-full md:w-2/3">
                  <EditableText path={`about.items.${idx}.value`} className="text-xl text-slate-800 block text-left font-light" element="div" />
                </div>
                {isAdmin && <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"><ListControls path="about.items" index={idx} listLength={data.about.items.length} /></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
