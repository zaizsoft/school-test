
export enum Step {
  DATA = 'data',
  CUSTOMIZE = 'customize',
  PREVIEW = 'preview'
}

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
  field: string;
  subLevel: string;
}

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
  right: number;
  left: number;
  verticalOffset: number;
}
