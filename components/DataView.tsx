
import React from 'react';
import { FileUp, Trash2, Users, Info, RotateCcw, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Student, SchoolConfig } from '../types';

interface DataViewProps {
  students: Student[];
  setStudents: (students: Student[]) => void;
  config: SchoolConfig;
  setConfig: React.Dispatch<React.SetStateAction<SchoolConfig>>;
  onToggleExempt: (id: number) => void;
  onReset: () => void;
}

const DataView: React.FC<DataViewProps> = ({ students, setStudents, config, setConfig, onToggleExempt, onReset }) => {
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      const newStudents: Student[] = [];
      // Digitalization files usually start names at row 8-9
      for (let i = 8; i < data.length; i++) {
        const row = data[i];
        if (row && row[1]) {
          newStudents.push({
            id: newStudents.length + 1,
            name: `${row[1]} ${row[2] || ''}`.trim(),
            isExempted: false
          });
        }
      }
      setStudents(newStudents);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Section: Student Management */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="text-blue-600 w-6 h-6" />
            <h2 className="text-xl font-bold text-slate-800">إدارة القائمة ({students.length} تلميذ)</h2>
          </div>
          {students.length > 0 && (
            <button 
              onClick={onReset}
              className="text-red-500 hover:text-red-700 font-bold text-sm flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              مسح القائمة
            </button>
          )}
        </div>

        {students.length === 0 ? (
          <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center bg-slate-50/50">
            <div className="bg-blue-100 p-6 rounded-full mb-6">
              <FileUp className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-black text-slate-700 mb-2">استيراد بيانات التلاميذ</h3>
            <p className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed">
              يمكنك رفع ملف "قائمة التلاميذ" المستخرج من منصة الرقمنة مباشرة، سيقوم النظام بمعالجة الأسماء تلقائياً.
            </p>
            <label className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 cursor-pointer hover:bg-blue-700 transition-all active:scale-95 inline-flex items-center gap-2">
              <FileUp className="w-5 h-5" />
              اختيار ملف Excel
              <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scroll">
            {students.map((student) => (
              <button
                key={student.id}
                onClick={() => onToggleExempt(student.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                  student.isExempted 
                  ? 'border-red-200 bg-red-50/50 opacity-80' 
                  : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${student.isExempted ? 'bg-red-500 border-red-500' : 'bg-white border-slate-200'}`}>
                    {student.isExempted && <div className="w-4 h-0.5 bg-white rounded-full"></div>}
                  </div>
                  <span className={`font-bold text-sm ${student.isExempted ? 'text-red-700 line-through' : 'text-slate-700'}`}>
                    {student.name}
                  </span>
                </div>
                <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{student.id}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Section: Info & Config */}
      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="text-blue-600 w-5 h-5" />
            <h3 className="font-black text-slate-800">تفاصيل الفوج المستخرجة</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-blue-500 mb-1">المؤسسة</p>
              <input 
                value={config.schoolName}
                onChange={e => setConfig({...config, schoolName: e.target.value})}
                className="w-full font-bold text-slate-700 text-sm focus:outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-green-500 mb-1">السنة</p>
                <input 
                  value={config.academicYear}
                  onChange={e => setConfig({...config, academicYear: e.target.value})}
                  className="w-full font-bold text-slate-700 text-sm focus:outline-none"
                />
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-orange-500 mb-1">الفصل</p>
                <select 
                  value={config.term}
                  onChange={e => setConfig({...config, term: e.target.value})}
                  className="w-full font-bold text-slate-700 text-sm focus:outline-none bg-transparent"
                >
                  <option>الفصل الأول</option>
                  <option>الفصل الثاني</option>
                  <option>الفصل الثالث</option>
                </select>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
              أولى إبتدائي (أ)
            </button>

            <button 
              onClick={onReset}
              className="w-full bg-red-50 text-red-500 py-3 rounded-2xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              مسح البيانات الحالية
            </button>
          </div>
        </div>

        <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100">
           <div className="flex items-start gap-3">
             <AlertCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
             <p className="text-xs text-blue-800 leading-relaxed font-bold">
               تلميح: اضغط على اسم التلميذ في القائمة لاستثنائه من الطباعة (معفى طبياً). سيظهر باللون الأحمر.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DataView;
