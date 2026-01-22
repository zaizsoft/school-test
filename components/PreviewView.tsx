
import React, { useState } from 'react';
import { 
  Printer, 
  Settings2, 
  X, 
  Plus, 
  Minus,
  Maximize2,
  MoveVertical
} from 'lucide-react';
import { Student, SchoolConfig, DocumentType, MarginSettings } from '../types';
import DocumentRenderer from './DocumentRenderer';

interface PreviewViewProps {
  students: Student[];
  config: SchoolConfig;
  documents: DocumentType[];
  margins: MarginSettings;
  setMargins: React.Dispatch<React.SetStateAction<MarginSettings>>;
}

const PreviewView: React.FC<PreviewViewProps> = ({ students, config, documents, margins, setMargins }) => {
  const [showSettings, setShowSettings] = useState(false);

  const selectedDocs = documents.filter(d => d.selected);

  if (selectedDocs.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] p-12 text-center border-slate-100 shadow-xl">
        <h2 className="text-2xl font-black text-slate-800 mb-4">لم يتم اختيار أي وثيقة</h2>
        <p className="text-slate-500">يرجى العودة لمرحلة التخصيص واختيار الوثائق التي تود طباعتها.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-900 -mx-4 -mt-8 md:-mx-8 md:-mt-8 p-12 flex flex-col items-center gap-12 overflow-x-hidden">
      {/* Visual Workspace Container */}
      <div className="w-full max-w-5xl flex flex-col gap-16 pb-32">
        {selectedDocs.map((doc, idx) => (
          <div key={doc.id} className="relative group">
            <div className="absolute -right-12 top-0 text-white/20 font-black text-6xl select-none no-print">
              0{idx + 1}
            </div>
            <div 
              className="bg-white mx-auto shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all print-page"
              style={{
                width: doc.id === 'attendance' ? '297mm' : '210mm',
                minHeight: doc.id === 'attendance' ? '210mm' : '297mm',
                paddingTop: `${margins.top}mm`,
                paddingBottom: `${margins.bottom}mm`,
                paddingRight: `${margins.right}mm`,
                paddingLeft: `${margins.left}mm`,
                marginTop: `${margins.verticalOffset}px`
              }}
            >
              <DocumentRenderer 
                type={doc.id} 
                students={students} 
                config={config} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Floating Precision Toolbar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] no-print">
        <div className="bg-white/95 backdrop-blur-xl rounded-full shadow-2xl border border-slate-200 px-6 py-4 flex items-center gap-6">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-full font-black shadow-xl shadow-blue-300 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Printer className="w-6 h-6" />
            تأكيد الطباعة الآن
          </button>
          
          <div className="h-10 w-px bg-slate-200" />
          
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-4 rounded-full transition-all ${showSettings ? 'bg-orange-100 text-orange-600 rotate-90' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            <Settings2 className="w-6 h-6" />
          </button>
        </div>

        {/* Precision Settings Modal/Panel */}
        {showSettings && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[350px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-800">التحكم الدقيق في الهوامش</h4>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Margin Controls */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase">الهامش العلوي</p>
                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl">
                      <button onClick={() => setMargins(m => ({...m, top: Math.max(0, m.top - 1)}))} className="p-1 hover:bg-white rounded shadow-sm text-slate-500"><Minus className="w-4 h-4"/></button>
                      <span className="flex-1 text-center font-bold text-sm">{margins.top}mm</span>
                      <button onClick={() => setMargins(m => ({...m, top: m.top + 1}))} className="p-1 hover:bg-white rounded shadow-sm text-slate-500"><Plus className="w-4 h-4"/></button>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase">إزاحة رأسية (بكسل)</p>
                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl">
                      <button onClick={() => setMargins(m => ({...m, verticalOffset: m.verticalOffset - 10}))} className="p-1 hover:bg-white rounded shadow-sm text-slate-500"><Minus className="w-4 h-4"/></button>
                      <span className="flex-1 text-center font-bold text-sm">{margins.verticalOffset}px</span>
                      <button onClick={() => setMargins(m => ({...m, verticalOffset: m.verticalOffset + 10}))} className="p-1 hover:bg-white rounded shadow-sm text-slate-500"><Plus className="w-4 h-4"/></button>
                    </div>
                 </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
                <Maximize2 className="w-5 h-5 text-blue-600 mt-1" />
                <p className="text-[10px] font-bold text-blue-800 leading-relaxed">
                  استخدم هذه الضوابط لضبط محاذاة النص تماماً مع الورق المطبوع مسبقاً إذا لزم الأمر.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewView;
