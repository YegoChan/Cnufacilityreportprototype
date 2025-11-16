import { Report } from '../components/ReportCard';

export interface Notification {
  id: string;
  type: 'resolved' | 'liked_resolved' | 'trending';
  title: string;
  message: string;
  reportId: string;
  timestamp: string;
  read: boolean;
}

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'resolved',
    title: '제보한 문제가 해결되었어요',
    message: '정심화관 엘리베이터 고장 문제가 해결되었습니다.',
    reportId: '4',
    timestamp: '30분 전',
    read: false,
  },
  {
    id: 'n2',
    type: 'liked_resolved',
    title: '공감한 문제가 해결되었어요',
    message: '공과대학 1층 화장실 수도 고장 문제가 해결되었습니다.',
    reportId: '1',
    timestamp: '1시간 전',
    read: false,
  },
  {
    id: 'n3',
    type: 'trending',
    title: '지금 핫한 불편함이 있어요 🔥',
    message: '중앙도서관 에어컨 고장이 89개의 공감을 받았습니다.',
    reportId: '2',
    timestamp: '2시간 전',
    read: false,
  },
  {
    id: 'n4',
    type: 'trending',
    title: '새로운 불편함이 급상승 중이에요',
    message: '기숙사 샤워실 온수 안 나옴이 빠르게 주목받고 있습니다.',
    reportId: '6',
    timestamp: '3시간 전',
    read: true,
  },
  {
    id: 'n5',
    type: 'resolved',
    title: '제보한 문제가 해결되었어요',
    message: '생활과학대 복도 조명 어두움 문제가 해결되었습니다.',
    reportId: '7',
    timestamp: '5시간 전',
    read: true,
  },
];

export const mockReports: Report[] = [
  {
    id: '1',
    author: {
      nickname: '프로불편러 차차',
      character: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    },
    title: '공과대학 1층 화장실 수도 고장',
    content: '공과대학 1층 남자 화장실 세면대 수도가 계속 물이 새고 있습니다. 벌써 일주일째인데 수리가 안 되고 있어요. 물이 계속 흐르다 보니 바닥도 미끄럽고 위험합니다.',
    image: 'https://images.unsplash.com/photo-1719050817004-c76eb7c75c99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9rZW4lMjBmYWNpbGl0eSUyMG1haW50ZW5hbmNlfGVufDF8fHx8MTc2MTgwNzc3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    location: '공과대학 1층',
    likes: 67,
    commentCount: 2,
    comments: [
      {
        id: 'c1',
        author: {
          nickname: '불편 사냥꾼 차차',
          character: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1',
        },
        content: '저도 어제 같은 문제 겪었어요.',
        timestamp: '1시간 전',
      },
      {
        id: 'c2',
        author: {
          nickname: '시설관리팀',
          character: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        },
        content: '수리가 완료되었습니다. 확인해주세요!',
        timestamp: '30분 전',
        isAdmin: true,
      },
    ],
    timestamp: '2시간 전',
    position: { x: 35, y: 30 },
    status: 'resolved',
  },
  {
    id: '2',
    author: {
      nickname: '예민보스 차차',
      character: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      equippedItems: ['crown'],
    },
    title: '중앙도서관 에어컨 고장',
    content: '중앙도서관 3층 열람실 에어컨이 작동하지 않습니다. 시험기간인데 너무 더워서 공부하기 힘들어요. 빠른 조치 부탁드립니다!',
    image: 'https://images.unsplash.com/photo-1758685848761-a55e08173622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2xhc3Nyb29tJTIwcHJvYmxlbXxlbnwxfHx8fDE3NjE4MDc3NzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: '중앙도서관 3층',
    likes: 89,
    commentCount: 1,
    comments: [
      {
        id: 'c3',
        author: {
          nickname: '시설관리팀',
          character: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        },
        content: '접수 완료했습니다. 조속히 처리하겠습니다.',
        timestamp: '2시간 전',
        isAdmin: true,
      },
    ],
    timestamp: '5시간 전',
    position: { x: 57, y: 28 },
    status: 'in_progress',
  },
  {
    id: '3',
    author: {
      nickname: '디테일 장인 차차',
      character: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    },
    title: '학생회관 식당 위생 문제',
    content: '학생회관 2층 식당에서 머리카락이 나왔습니다. 위생 관리 좀 더 철저히 해주세요.',
    image: 'https://images.unsplash.com/photo-1601351841251-766245326eee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZldGVyaWElMjBkaW5pbmclMjBoYWxsfGVufDF8fHx8MTc2MTcxMDQ3MXww&ixlib=rb-4.1.0&q=80&w=1080',
    location: '학생회관 2층 식당',
    likes: 52,
    commentCount: 0,
    comments: [],
    timestamp: '1일 전',
    position: { x: 16, y: 55 },
    status: 'received',
  },
  {
    id: '4',
    author: {
      nickname: '캠퍼스 지킴이 차차',
      character: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    },
    title: '정심화관 엘리베이터 고장',
    content: '정심화관 서쪽 엘리베이터가 또 고장났어요. 항상 고장나는데 근본적인 수리가 필요한 것 같습니다.',
    location: '정심화관',
    likes: 45,
    commentCount: 1,
    comments: [
      {
        id: 'c4',
        author: {
          nickname: '시설관리팀',
          character: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        },
        content: '수리가 완료되었습니다. 확인해주세요!',
        timestamp: '30분 전',
        isAdmin: true,
      },
    ],
    timestamp: '3시간 전',
    position: { x: 16, y: 30 },
    status: 'resolved',
  },
  {
    id: '5',
    author: {
      nickname: '관찰력 갑 차차',
      character: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    },
    title: '자연대 강의실 빔프로젝터 불량',
    content: '자연대 305호 빔프로젝터 화면이 계속 깜빡입니다. 수업 듣기 불편해요.',
    location: '자연대 305호',
    likes: 28,
    commentCount: 0,
    comments: [],
    timestamp: '6시간 전',
    position: { x: 57, y: 55 },
    status: 'inconvenient',
  },
  {
    id: '6',
    author: {
      nickname: '끈질긴 차차',
      character: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    },
    title: '기숙사 샤워실 온수 안 나옴',
    content: '기숙사 3동 샤워실에서 온수가 안 나와요. 겨울인데 찬물로 씻을 수가 없습니다.',
    location: '기숙사 3동',
    likes: 73,
    commentCount: 1,
    comments: [
      {
        id: 'c5',
        author: {
          nickname: '시설관리팀',
          character: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        },
        content: '접수 완료했습니다. 조속히 처리하겠습니다.',
        timestamp: '1시간 전',
        isAdmin: true,
      },
    ],
    timestamp: '4시간 전',
    position: { x: 83, y: 30 },
    status: 'in_progress',
  },
  {
    id: '7',
    author: {
      nickname: '컴플레인 마스터 차차',
      character: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
    },
    title: '생활과학대 복도 조명 어두움',
    content: '생활과학대 4층 복도 조명이 반 이상 나가서 너무 어둡습니다. 안전사고 우려됩니다.',
    image: 'https://images.unsplash.com/photo-1738502601912-107ba7af5459?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW1hZ2VkJTIwZmxvb3IlMjByZXBhaXJ8ZW58MXx8fHwxNzYxODA3NzczfDA&ixlib=rb-4.1.0&q=80&w=1080',
    location: '생활과학대 4층',
    likes: 36,
    commentCount: 1,
    comments: [
      {
        id: 'c6',
        author: {
          nickname: '시설관리팀',
          character: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        },
        content: '수리가 완료되었습니다. 확인해주세요!',
        timestamp: '2시간 전',
        isAdmin: true,
      },
    ],
    timestamp: '8시간 전',
    position: { x: 35, y: 55 },
    status: 'resolved',
  },
  {
    id: '8',
    author: {
      nickname: '불편한 것도 참 많은 차차',
      character: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
    },
    title: '중앙광장 벤치 페인트 벗겨짐',
    content: '중앙광장 벤치들 페인트가 다 벗겨져서 앉으면 옷에 묻어요. 새 페인트칠 필요합니다.',
    location: '중앙광장',
    likes: 19,
    commentCount: 0,
    comments: [],
    timestamp: '12시간 전',
    position: { x: 42, y: 75 },
    status: 'inconvenient',
  },
];