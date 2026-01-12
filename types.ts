export interface Resource {
  id: string;
  title: string;
  category: 'Computer' | 'Civil' | 'Electrical' | 'Mechanical';
  semester?: string;
  pdfLink: string;
  createdAt: number; // Storing as plain number (ms)
}

export interface JobUpdate {
  id: string;
  title: string;
  description: string;
  link?: string;
  imageUrl?: string;
  createdAt: number; // Storing as plain number (ms)
}

export interface Notice {
  id: string;
  title: string;
  text: string;
  createdAt: number; // Storing as plain number (ms)
}

export enum Department {
  Computer = 'Computer',
  Civil = 'Civil',
  Electrical = 'Electrical',
  Mechanical = 'Mechanical'
}

export const Semesters = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester"
];