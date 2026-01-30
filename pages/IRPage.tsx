
import React from 'react';

const IRPage = ({ data, isAdmin, EditableText }: any) => {
  return (
    <div className="pt-32 pb-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase mb-4">Investor Relations</h2>
          <EditableText path="ir.title" className="text-4xl font-bold text-slate-900 block" element="h3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl corporate-shadow">
            <h4 className="text-xl font-bold mb-6 border-l-4 border-blue-600 pl-4">財務ハイライト</h4>
            <div className="h-64 bg-slate-50 rounded-xl flex items-end justify-between p-6 gap-2">
              {[60, 80, 75, 95, 120].map((h, i) => (
                <div key={i} className="w-full bg-blue-600 rounded-t-lg transition-all duration-1000" style={{ height: `${h}%` }}>
                  <div className="text-[10px] text-center -top-6 relative font-bold text-slate-400">FY202{i}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500 text-center">売上高推移 (単位: 兆円)</p>
          </div>

          <div className="bg-white p-8 rounded-3xl corporate-shadow flex flex-col">
            <h4 className="text-xl font-bold mb-6 border-l-4 border-blue-600 pl-4">最新IR資料</h4>
            <div className="space-y-4 flex-1">
              {['2025年3月期 第2四半期 決算説明資料', 'アニュアルレポート 2024', '株主通信 第45期', 'ESG説明会 発表スライド'].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors group">
                  <span className="text-sm font-medium">{doc}</span>
                  <i className="fa-solid fa-file-pdf text-red-500 group-hover:scale-125 transition-transform"></i>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <p className="text-slate-400 text-sm mb-2">証券コード</p>
              <EditableText path="ir.stockCode" className="text-3xl font-bold block" />
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">単元株式数</p>
              <EditableText path="ir.units" className="text-3xl font-bold block" />
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">発行済株式総数</p>
              <EditableText path="ir.totalShares" className="text-3xl font-bold block" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IRPage;
