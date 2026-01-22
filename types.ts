
export interface Student {
  id: number;
  name: string;
  isExempted: boolean;
}

export interface SchoolConfig {
  schoolName: string;
  teacherName: string;
  academicYear: string;
  level: string;
  term: string;
  subLevel: string;
}

export interface PedagogicalData {
  kafaa: string;
  criteria: string[];
}

export interface AppState {
  students: Student[];
  config: SchoolConfig;
  visiblePages: {
    diagnostic: boolean;
    achievement: boolean;
    performance: boolean;
    attendance: boolean;
    separator: boolean;
  };
  signature: string | null;
}

// Added missing types for CustomizationView and PreviewView
export interface DocumentType {
  id: string;
  title: string;
  description: string;
  icon: string;
  selected: boolean;
}

export interface MarginSettings {
  top: number;
  bottom: number;
  left: number;
  right: number;
  verticalOffset: number;
}
