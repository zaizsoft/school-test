
import React from 'react';
import { 
  ClipboardList, 
  Trophy, 
  Activity, 
  CalendarDays, 
  Layers, 
  CheckCircle2,
  LucideIcon
} from 'lucide-react';
import { DocumentType } from '../types';

const IconsMap: Record<string, LucideIcon> = {
  ClipboardList,
  Trophy,
  Activity,
  CalendarDays,
  Layers
};

interface CustomizationViewProps {
  documents: DocumentType[];
  setDocuments: (docs: DocumentType[]) => void;
}

const CustomizationView: React.FC<CustomizationViewProps> = ({ documents, setDocuments }) => {
  
  const toggleDocument = (id: string) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, selected: !doc.selected } : doc
    ));
  };

  return (
    <div className="text-center py-6">
      <h2 className="text-4xl font-black text-slate-800 mb-2">اختر الوثائق المراد استخراجها</h2>
      <p className="text-slate-500 font-bold mb-12">حدد الوثائق التي ترغب في تضمينها في ملف الطباعة النهائي</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {documents.map((doc) => {
          const Icon = IconsMap[doc.icon];
          return (
            <button
              key={doc.id}
              onClick={() => toggleDocument(doc.id)}
              className={`relative group p-10 rounded-[2.5rem] transition-all duration-300 flex flex-col items-center text-center ${
                doc.selected 
                ? 'bg-white border-4 border-orange-400 shadow-2xl scale-[1.02]' 
                : 'bg-white border border-slate-100 hover:border-slate-300 shadow-sm opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
              }`}
            >
              {doc.selected && (
                <div className="absolute top-4 right-4 text-orange-400">
                  <CheckCircle2 className="w-8 h-8 fill-orange-50" />
                </div>
              )}
              
              <div className={`p-6 rounded-[1.5rem] mb-6 transition-all ${doc.selected ? 'bg-orange-50 text-orange-500' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                <Icon className="w-12 h-12" />
              </div>

              <h3 className={`text-2xl font-black mb-3 ${doc.selected ? 'text-slate-800' : 'text-slate-500'}`}>
                {doc.title}
              </h3>
              <p className="text-slate-400 text-sm font-bold leading-relaxed">
                {doc.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CustomizationView;
