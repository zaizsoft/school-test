
import React, { useState } from 'react';
import { 
  Printer, 
  Settings2, 
  X, 
  Plus, 
  Minus,
  Maximize2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight
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

  const updateMargin = (key: keyof MarginSettings, delta: number) => {
    setMargins(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta)
    }));
  };

  return (
    <div className="relative min-h-screen bg-slate-900 -mx-4 -mt-8 md:-mx-8 md:-mt-8 p-4 md:p-8 flex flex-col items-center gap-8 overflow-x-hidden">
      {/* Visual Workspace Container */}
      <div className="w-full max-w-6xl flex flex-col gap-8 pb-32">
        {selectedDocs.map((doc, idx) => (
          <div key={doc.id} className="relative group">
            <div className="absolute -right-8 top-0 text-white/10 font-black text-7xl select-none no-print">
              {idx + 1}
            </div>
            <div 
              className="bg-white mx-auto shadow-2xl shadow-black/50 transition-all print-page overflow-hidden"
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
            طباعة الوثائق
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
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[380px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-800">التحكم الدقيق (Precision)</h4>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Vertical Offset Control */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">الإزاحة الرأسية الكلية</p>
                <div className="flex items-center justify-center gap-4">
                  <button onClick={() => updateMargin('verticalOffset', -5)} className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 text-slate-600 transition-all"><ChevronUp className="w-5 h-5"/></button>
                  <div className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-2xl font-black text-blue-600 min-w-[100px] text-center">{margins.verticalOffset}px</div>
                  <button onClick={() => updateMargin('verticalOffset', 5)} className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 text-slate-600 transition-all"><ChevronDown className="w-5 h-5"/></button>
                </div>
              </div>

              {/* Margin Grid Controls */}
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { key: 'top', label: 'أعلى', icon: <ChevronUp className="w-3 h-3"/> },
                   { key: 'bottom', label: 'أسفل', icon: <ChevronDown className="w-3 h-3"/> },
                   { key: 'right', label: 'يمين', icon: <ChevronRight className="w-3 h-3"/> },
                   { key: 'left', label: 'يسار', icon: <ChevronLeft className="w-3 h-3"/> }
                 ].map((item) => (
                   <div key={item.key} className="space-y-1.5">
                      <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1">
                        {item.icon} {item.label} (mm)
                      </p>
                      <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                        <button onClick={() => updateMargin(item.key as any, -1)} className="p-1 hover:bg-white rounded-lg shadow-sm text-slate-400 hover:text-slate-600 transition-all"><Minus className="w-3 h-3"/></button>
                        <span className="flex-1 text-center font-bold text-xs text-slate-700">{margins[item.key as keyof MarginSettings]}</span>
                        <button onClick={() => updateMargin(item.key as any, 1)} className="p-1 hover:bg-white rounded-lg shadow-sm text-slate-400 hover:text-slate-600 transition-all"><Plus className="w-3 h-3"/></button>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100">
                <Maximize2 className="w-5 h-5 text-blue-600 mt-1" />
                <p className="text-[10px] font-bold text-blue-800 leading-relaxed">
                  يتم تطبيق هذه الإعدادات لحظياً على المعاينة. الهوامش تساعد في تجنب "قص" المحتوى عند الطباعة.
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
