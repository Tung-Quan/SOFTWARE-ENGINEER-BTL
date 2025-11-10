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

export const dataCourses = [{
  id: '4',
  code: '79748_CO2013_003186_CLC',
  title: 'Principles of Programming Language',
  instructor: 'Nguyễn Hứa Phùng',
  content: [
    {
      type: 'introduction',
      title: 'Giới thiệu khóa học',
      data: {
        text: 'Đây là khóa học Principles of Programming Language. Khóa học cung cấp kiến thức nền tảng và thực hành về lĩnh vực này.'
      }
    },
    {
      type: 'material',
      title: 'Material',
      data: {
        document: {
          id: 'a1',
          title: '01_Ch1 Introduction_2025',
          description: 'Thiết kế bài tập về nhà chương 1: Giới thiệu về ngôn ngữ lập trình',
          dueDate: '2024-09-15',
          source: '01_Ch1_Introduction_2025.pdf',
        }
      }
    },
    {
      type: 'movie',
      title: 'Movie 1',
      data: {
        video: {
          id: 'm1',
          title: 'Giới thiệu về ngôn ngữ lập trình',
          description: 'Video giới thiệu các khái niệm cơ bản về ngôn ngữ lập trình.',
          url: 'https://www.youtube.com/watch?v=Kcp48dcm4QA',
        }
      }
    },
    {
      type: 'note',
      title: 'Note for Assignment 1',
      data: {
        assignment: {
          id: 'd1',
          title: 'Bài tập về nhà 1: Cài đặt ngôn ngữ lập trình đơn giản',
          description: 'In MiniGo, an identifier is the name used to identify variables, constants, types, functions, or other user-defined elements within a program. Identifiers must adhere to the following rules:\n\tComposition: An identifier must start with a letter(A- Z or a - z) or an underscore().Subsequent characters can include letters, digits(0 - 9), or underscores.\n\tCase Sensitivity: Identifiers are case-sensitive, meaning myVariable and MyVariable are treated as distinct identifiers.\n\tLength: There is no explicit limit on the length of an identifier, but it is recommended to use concise yet descriptive names for clarity.\n\tKeywords Restriction: Identifiers cannot be the same as any reserved keyword in MiniGo.',
          dueDate: '2024-10-01',
          source: 'assignment1.pdf',
        }
      }
    },
    {
      type: 'reference',
      title: 'Reference',
      data: {
        link: {
          id: 'l1',
          title: 'Giới thiệu về ngôn ngữ lập trình',
          url: 'https://example.com/intro-to-programming-languages',
        }
      }
    },
    {
      type: 'submission',
      title: 'Submission 1',
      data: {
        status: 'submitted',
        submittedFile: {
          name: 'MiniGo_Specifications.pdf',
          submittedAt: '20:00 10/10/2024'
        },
        dueDate: '20:00 10/10/2024',
        canEdit: false,
        maxFiles: 1,
        allowedTypes: ['pdf', 'doc', 'docx']
      }
    },
    {
      type: 'submission',
      title: 'Submission 2',
      data: {

        status: 'graded',
        submittedFile: {
          name: 'group07_report 02.pdf',
          submittedAt: '18:30 10/10/2024'
        },
        dueDate: '20:00 10/10/2024',
        grade: 2.5,
        maxGrade: 10,
        feedback: 'Lorem ipsum',
        canEdit: false,
        maxFiles: 2,
        allowedTypes: ['pdf', 'docx']
      }
    },
    {
      type: 'submission',
      title: 'Submission 3',
      data: {
        status: 'not-submitted',
        dueDate: '20:00 15/11/2024',
        canEdit: true,
        maxFiles: 3,
        allowedTypes: ['pdf', 'docx', 'zip']
      }
    },
    {
      type: 'reference',
      title: 'Reference 2',
      data: {
        link: {
          id: 'l3',
          title: 'Các cấu trúc dữ liệu cơ bản',
          url: 'https://example.com/basic-data-structures',
        }
      }
    }
  ]
}];
// Mock: số lượng bài đã nộp theo khóa học và submission
// key: courseId -> key: submission key (tên hoặc id) -> số bài đã nộp
export const mockSubmissionSubmittedCounts: Record<string, Record<string, number>> = {
  '4': {
    // 'Submission 1' trong dataCourses cho course id 4
    submission1: 1,
  },
};


export const mockSubmissionEntries: Record<string, Record<string, Array<{ name: string; email: string; submittedAt: string; score?: number }>>> = {
  '4': {
    submission1: [
      {
        name: 'Nguyễn Trần Văn AAA',
        email: 'nguyentranvanaaa123456789@gmail.com',
        submittedAt: '19:00 10/10/2024',
        score: 7.5,
      },
      {
        name: 'Nguyễn Trần Văn AAA',
        email: 'nguyentranvanaaa123456789@gmail.com',
        submittedAt: '19:00 11/10/2024',
        score: 5,
      },
      {
        name: 'Nguyễn Trần Văn AAA',
        email: 'nguyentranvanaaa123456789@gmail.com',
        submittedAt: '19:00 12/10/2024',
        score: 2.5,
      },
    ],
    submission2: [
      {
        name: 'Nguyễn Trần Văn BBB',
        email: 'nguyentranvanbbb@example.com',
        submittedAt: '18:30 10/10/2024',
        score: 5,
      },
      {
        name: 'Lê Thị C',
        email: 'le.ti.c@example.com',
        submittedAt: '19:15 10/10/2024',
        score: 6,
      },
    ],
    // Submission 3 - pending / not graded
    submission3: [
      {
        name: 'Phạm Văn D',
        email: 'phamvand@example.com',
        submittedAt: '19:00 15/11/2024',
      },
    ],
  },
};