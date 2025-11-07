import bgBlue from '@/assets/bg-dashboard-blue.png';
import bgGreen from '@/assets/bg-dashboard-green.png';
import bgRed from '@/assets/bg-dashboard-red.png';

export type Course = {
  id: string;
  code: string;
  title: string;
  instructor: string;
  stats: {
    documents: number;
    links: number;
    assignments: number;
  };
  bgImage: string;
};

export const mockCourses: Course[] = [
  {
    id: '1',
    code: '79748_CO2013_003183_CLC',
    title: 'Computer Network',
    instructor: 'Nguyễn Lê Duy Lai',
    stats: { documents: 3, links: 2, assignments: 0 },
    bgImage: bgBlue,
  },
  {
    id: '2',
    code: '79748_CO2013_003184_CLC',
    title: 'Database System',
    instructor: 'Nguyễn Thị Ái Thảo',
    stats: { documents: 5, links: 1, assignments: 1 },
    bgImage: bgRed,
  },
  {
    id: '3',
    code: '79748_CO2013_003185_CLC',
    title: 'Operating System',
    instructor: 'Ngô Thị Vân',
    stats: { documents: 2, links: 3, assignments: 2 },
    bgImage: bgGreen,
  },
  {
    id: '4',
    code: '79748_CO2013_003186_CLC',
    title: 'Principles of Programming Language',
    instructor: 'Nguyễn Hứa Phùng',
    stats: { documents: 4, links: 2, assignments: 1 },
    bgImage: bgBlue,
  },
  {
    id: '5',
    code: '79748_CO2013_003187_CLC',
    title: 'Algorithms',
    instructor: 'Nguyễn Hứa Phùng',
    stats: { documents: 6, links: 0, assignments: 3 },
    bgImage: bgRed,
  },
  {
    id: '6',
    code: '79748_CO2013_003188_CLC',
    title: 'Data Structures',
    instructor: 'Ngô Thị F',
    stats: { documents: 4, links: 2, assignments: 1 },
    bgImage: bgGreen,
  },
  {
    id: '7',
    code: '79748_CO2013_003189_CLC',
    title: 'Software Engineering',
    instructor: 'Trần Trương Tuấn Phát',
    stats: { documents: 5, links: 2, assignments: 2 },
    bgImage: bgBlue,
  },
  {
    id: '8',
    code: '79748_CO2013_003190_CLC',
    title: 'Computer Graphics',
    instructor: 'Đặng Thị H',
    stats: { documents: 3, links: 1, assignments: 0 },
    bgImage: bgRed,
  },
  {
    id: '9',
    code: '79748_CO2013_003191_CLC',
    title: 'Artificial Intelligence',
    instructor: 'Võ Văn I',
    stats: { documents: 7, links: 3, assignments: 4 },
    bgImage: bgGreen,
  },
  {
    id: '10',
    code: '79748_CO2013_003192_CLC',
    title: 'Operating Systems II',
    instructor: 'Trịnh Thị K',
    stats: { documents: 2, links: 0, assignments: 1 },
    bgImage: bgBlue,
  },
  {
    id: '11',
    code: '79748_CO2013_003193_CLC',
    title: 'Networks II',
    instructor: 'Phan Văn L',
    stats: { documents: 3, links: 2, assignments: 1 },
    bgImage: bgRed,
  },
  {
    id: '12',
    code: '79748_CO2013_003194_CLC',
    title: 'Database II',
    instructor: 'Lý Thị M',
    stats: { documents: 4, links: 2, assignments: 2 },
    bgImage: bgGreen,
  },
];
