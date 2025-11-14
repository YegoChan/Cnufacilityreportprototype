import { useState, useMemo, useEffect } from 'react';
import { TrendingReports } from './components/TrendingReports';
import { ReportMap } from './components/ReportMap';
import { LocationPickerMap } from './components/LocationPickerMap';
import { Report, ReportCard, ReportStatus, Comment } from './components/ReportCard';
import { NotificationPanel } from './components/NotificationPanel';
import { LoginScreen } from './components/LoginScreen';
import { SideMenu } from './components/SideMenu';
import { MyPage } from './components/MyPage';
import { SettingsPage } from './components/SettingsPage';
import { ShopPage } from './components/ShopPage';
import { Achievement } from './components/AchievementsTab';
import { PointHistory, PointTransaction } from './components/PointHistory';
import { RankingSystem, RankingUser } from './components/RankingSystem';
import { mockReports, mockNotifications, Notification } from './lib/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Button } from './components/ui/button';
import { Plus, Menu, ArrowUpDown, Shield, Camera, Image as ImageIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { Textarea } from './components/ui/textarea';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import chachaImage from 'figma:asset/58a6df21cd2b1931395a1e589b5c4237d4dac6ee.png';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';

const statusConfig = {
  inconvenient: { label: '불편해요', color: 'bg-red-100 text-red-700 border-red-200' },
  received: { label: '문제 접수', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  in_progress: { label: '해결 중', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  resolved: { label: '해결 완료', color: 'bg-green-100 text-green-700 border-green-200' },
};

type SortOption = 'latest' | 'likes';

// 업적 목록 (칭호 포함)
const achievements: Achievement[] = [
  // 제보 활동
  { id: 'first_report', title: '첫 발걸음', description: '첫 제보 작성하기', points: 50, requirement: 1, icon: '🎯', category: 'report', rewardTitle: 'title_beginner' },
  { id: 'reports_5', title: '제보 초보자', description: '제보 5개 작성하기', points: 100, requirement: 5, icon: '📝', category: 'report', rewardTitle: 'title_reporter' },
  { id: 'reports_10', title: '제보 숙련자', description: '제보 10개 작성하기', points: 200, requirement: 10, icon: '📋', category: 'report', rewardTitle: 'title_expert' },
  { id: 'reports_20', title: '캠퍼스 지킴이', description: '제보 20개 작성하기', points: 500, requirement: 20, icon: '🛡️', category: 'report', rewardTitle: 'title_guardian' },
  
  // 소셜 활동
  { id: 'first_comment', title: '대화의 시작', description: '첫 댓글 작성하기', points: 30, requirement: 1, icon: '💬', category: 'social', rewardTitle: 'title_chatterer' },
  { id: 'comments_10', title: '수다쟁이', description: '댓글 10개 작성하기', points: 100, requirement: 10, icon: '🗣️', category: 'social', rewardTitle: 'title_talker' },
  { id: 'comments_30', title: '소통 전문가', description: '댓글 30개 작성하기', points: 300, requirement: 30, icon: '🎤', category: 'social', rewardTitle: 'title_communicator' },
  
  // 참여도
  { id: 'likes_10', title: '공감 초보', description: '공감 10개 받기', points: 150, requirement: 10, icon: '❤️', category: 'engagement', rewardTitle: 'title_liked' },
  { id: 'likes_50', title: '인기인', description: '공감 50개 받기', points: 300, requirement: 50, icon: '💖', category: 'engagement', rewardTitle: 'title_popular' },
  { id: 'likes_100', title: '공감왕', description: '공감 100개 받기', points: 600, requirement: 100, icon: '👑', category: 'engagement', rewardTitle: 'title_king' },
  { id: 'give_likes_20', title: '응원단', description: '다른 제보에 공감 20번 누르기', points: 100, requirement: 20, icon: '👏', category: 'engagement', rewardTitle: 'title_supporter' },
  
  // 특별 업적
  { id: 'bookmarks_5', title: '컬렉터', description: '즐겨찾기 5개 추가하기', points: 80, requirement: 5, icon: '⭐', category: 'special', rewardTitle: 'title_collector' },
  { id: 'shop_purchase', title: '쇼핑 왕', description: '상점에서 첫 구매하기', points: 100, requirement: 1, icon: '🛒', category: 'special', rewardTitle: 'title_shopper' },
  { id: 'profile_custom', title: '패셔니스타', description: '아이템 장착하기', points: 50, requirement: 1, icon: '👔', category: 'special', rewardTitle: 'title_fashionista' },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ nickname: string; character: string; department: string } | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [reportStatus, setReportStatus] = useState<ReportStatus>('inconvenient');
  const [newComment, setNewComment] = useState('');
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [openedFromNotification, setOpenedFromNotification] = useState(false);
  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false);
  const [newReportTitle, setNewReportTitle] = useState('');
  const [newReportLocation, setNewReportLocation] = useState('');
  const [newReportDetailAddress, setNewReportDetailAddress] = useState('');
  const [newReportPosition, setNewReportPosition] = useState<{ x: number; y: number } | null>(null);
  const [newReportContent, setNewReportContent] = useState('');
  const [newReportImage, setNewReportImage] = useState('');
  const [imageUploadMethod, setImageUploadMethod] = useState<'gallery' | 'camera' | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editReportTitle, setEditReportTitle] = useState('');
  const [editReportContent, setEditReportContent] = useState('');
  const [editReportImage, setEditReportImage] = useState('');
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('none');
  const [equippedItems, setEquippedItems] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [points, setPoints] = useState(200);
  const [ownedTitles, setOwnedTitles] = useState<string[]>(['none']);
  const [ownedItems, setOwnedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [pageInput, setPageInput] = useState('');
  const [likedReports, setLikedReports] = useState<Set<string>>(new Set());
  const [bookmarkedReports, setBookmarkedReports] = useState<Set<string>>(new Set());
  const [completedAchievements, setCompletedAchievements] = useState<Set<string>>(new Set());
  const [achievementProgress, setAchievementProgress] = useState<Record<string, number>>({});
  const [pointHistory, setPointHistory] = useState<PointTransaction[]>([]);
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [settings, setSettings] = useState({
    pushNotifications: true,
    notifyOnComment: true,
    notifyOnLike: true,
    notifyOnStatusChange: true,
    darkMode: false,
    hideResolvedReports: false,
    autoLocationTracking: true,
    fontSize: 100,
    language: 'ko',
    autoLogin: true,
  });

  // 초기 포인트 설정 (200포인트로 강제 설정)
  useEffect(() => {
    if (isLoggedIn && pointHistory.length === 0) {
      setPoints(200);
    }
  }, [isLoggedIn, pointHistory.length]);

  // timestamp 텍스트를 분 단위 숫자로 변환하는 함수
  const parseTimestamp = (timestamp: string): number => {
    if (timestamp.includes('분 전')) {
      return parseInt(timestamp);
    } else if (timestamp.includes('시간 전')) {
      return parseInt(timestamp) * 60;
    } else if (timestamp.includes('일 전')) {
      return parseInt(timestamp) * 60 * 24;
    }
    return 0;
  };

  const sortedReports = useMemo(() => {
    let reportsCopy = [...reports];
    
    // 해결된 제보 숨기기 필터
    if (settings.hideResolvedReports) {
      reportsCopy = reportsCopy.filter(r => r.status !== 'resolved');
    }
    
    if (sortBy === 'latest') {
      // 최신순은 timestamp를 파싱해서 정렬 (작은 값이 최신)
      return reportsCopy.sort((a, b) => parseTimestamp(a.timestamp) - parseTimestamp(b.timestamp));
    } else {
      // 공감순
      return reportsCopy.sort((a, b) => b.likes - a.likes);
    }
  }, [reports, sortBy, settings.hideResolvedReports]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = sortedReports.slice(startIndex, endIndex);

  // iframe 메시지 수신 (지도 마커 클릭)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('메시지 수신:', event.data, 'from:', event.origin);
      
      // 메시지 타입 확인
      if (event.data && event.data.type === 'markerClick' && event.data.reportId) {
        console.log('🗺️ 마커 클릭 메시지 수신! reportId:', event.data.reportId);
        const report = reports.find(r => r.id === event.data.reportId);
        if (report) {
          console.log('✅ 제보 찾음:', report.title);
          handlePinClick(report);
          
          // 성공 토스트
          toast.success('지도 마커 클릭', {
            description: `${report.title} 상세보기`,
            duration: 2000,
          });
        } else {
          console.error('❌ 제보를 찾을 수 없음. reportId:', event.data.reportId);
          console.log('현재 제보 ID 목록:', reports.map(r => r.id));
        }
      }
    };

    console.log('✅ 메시지 리스너 등록됨');
    window.addEventListener('message', handleMessage);
    return () => {
      console.log('❌ 메시지 리스너 제거됨');
      window.removeEventListener('message', handleMessage);
    };
  }, [reports]);

  // 페이지 변경 시 맨 위로 스크롤
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 페이지 입력으로 이동
  const handlePageInputSubmit = () => {
    const pageNum = parseInt(pageInput);
    if (pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum);
      setPageInput('');
    } else {
      alert(`1부터 ${totalPages}까지의 페이지 번호를 입력해주세요.`);
    }
  };

  const handlePinClick = (report: Report) => {
    setSelectedReport(report);
    setReportStatus(report.status);
    setOpenedFromNotification(false);
    setIsEditMode(false);
  };

  const handleNotificationClick = (reportId: string) => {
    const report = mockReports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setReportStatus(report.status);
      setOpenedFromNotification(true);
      setNotifications(prev => 
        prev.map(n => 
          n.reportId === reportId ? { ...n, read: true } : n
        )
      );
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleToggleLike = (reportId: string) => {
    setLikedReports(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reportId)) {
        newSet.delete(reportId);
      } else {
        newSet.add(reportId);
      }
      return newSet;
    });

    // reports 배열의 likes 수를 업데이트
    setReports(prev => prev.map(report => {
      if (report.id === reportId) {
        const isCurrentlyLiked = likedReports.has(reportId);
        return {
          ...report,
          likes: isCurrentlyLiked ? report.likes - 1 : report.likes + 1
        };
      }
      return report;
    }));
  };

  const handleToggleBookmark = (reportId: string) => {
    setBookmarkedReports(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reportId)) {
        newSet.delete(reportId);
      } else {
        newSet.add(reportId);
      }
      return newSet;
    });
  };

  const handleStatusChange = (newStatus: ReportStatus) => {
    setReportStatus(newStatus);
    if (selectedReport) {
      setSelectedReport({ ...selectedReport, status: newStatus });
    }
  };

  const handleLogin = (studentId: string, isAdmin: boolean, department: string) => {
    // Generate a nickname - 모든 사용자는 '차차'로 통일
    const baseNickname = isAdmin ? '관리자' : '차차';
    const character = `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentId}`;
    setCurrentUser({ nickname: baseNickname, character, department });
    setIsLoggedIn(true);
    setIsAdminMode(isAdmin);
    setCurrentTitle('none');
    setEquippedItems([]);
    setPoints(1000);
    setOwnedTitles(['none']);
    setOwnedItems([]);
  };

  // 포인트 히스토리 추가
  const addPointTransaction = (type: 'earn' | 'spend', amount: number, reason: string) => {
    const transaction: PointTransaction = {
      id: `trans_${Date.now()}_${Math.random()}`,
      type,
      amount,
      reason,
      timestamp: new Date().toLocaleString('ko-KR'),
    };
    setPointHistory(prev => [transaction, ...prev]);
  };

  // 업적 달성 시 칭호 자동 부여
  const checkAndCompleteAchievement = (achievementId: string) => {
    if (completedAchievements.has(achievementId)) return;

    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return;

    setCompletedAchievements(prev => new Set([...prev, achievementId]));
    setPoints(prev => prev + achievement.points);
    addPointTransaction('earn', achievement.points, `업적 달성: ${achievement.title}`);

    // 칭호 자동 부여
    if (achievement.rewardTitle && !ownedTitles.includes(achievement.rewardTitle)) {
      setOwnedTitles(prev => [...prev, achievement.rewardTitle!]);
      toast.success(`🎉 업적 달성!`, {
        description: `${achievement.title} (+${achievement.points}P + 칭호 획득)`,
      });
    } else {
      toast.success(`🎉 업적 달성!`, {
        description: `${achievement.title} (+${achievement.points}P)`,
      });
    }
  };

  const handleTitleChange = (titleId: string) => {
    setCurrentTitle(titleId);
    if (currentUser) {
      const titleMap: { [key: string]: string } = {
        'none': '',
        // 업적 칭호
        'title_beginner': '새내기',
        'title_reporter': '제보러',
        'title_expert': '전문가',
        'title_guardian': '캠퍼스 지킴이',
        'title_chatterer': '수다쟁이',
        'title_talker': '말빨',
        'title_communicator': '소통왕',
        'title_liked': '인싸',
        'title_popular': '인기인',
        'title_king': '공감왕',
        'title_supporter': '응원단',
        'title_collector': '컬렉터',
        'title_shopper': '쇼핑왕',
        'title_fashionista': '패셔니스타',
        // 기존 칭호
        'pro_complainer': '프로불편러',
        'picky': '불편한 것도 참 많은',
        'sensitive': '예민보스',
        'detail_oriented': '디테일 장인',
        'campus_guardian': '캠퍼스 지킴이',
        'issue_hunter': '불편 사냥꾼',
        'complaint_master': '컴플레인 마스터',
        'legendary_complainer': '전설의 불평러',
        'observant': '관찰력 갑',
        'persistent': '끈질긴',
        // 상점 칭호
        'fashionista': '패션왕',
        'shining': '빛나는',
        'gold_member': '골드 멤버',
        'vip': 'VIP',
        'luxury': '럭셔리',
        'elite': '엘리트',
        'premium': '프리미엄',
        'special': '스페셜',
        'unique': '유니크',
        'trendy': '트렌디',
        'cool': '쿨한',
        'smart': '똑똑한',
        'cute': '귀여운',
        'energetic': '에너제틱',
        'legendary': '전설의',
      };
      
      const baseNickname = '차차';
      const newNickname = titleMap[titleId] ? `${titleMap[titleId]} ${baseNickname}` : baseNickname;
      setCurrentUser({ ...currentUser, nickname: newNickname });
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleEquipItem = (itemId: string) => {
    setEquippedItems(prev => {
      const newItems = [...prev, itemId];
      
      // 첫 아이템 장착 업적 체크
      if (prev.length === 0) {
        const currentProgress = achievementProgress['profile_custom'] || 0;
        if (currentProgress === 0) {
          setTimeout(() => {
            setAchievementProgress(p => ({ ...p, profile_custom: 1 }));
            checkAndCompleteAchievement('profile_custom');
          }, 100);
        }
      }
      
      return newItems;
    });
  };

  const handleUnequipItem = (itemId: string) => {
    setEquippedItems(prev => prev.filter(id => id !== itemId));
  };

  const handlePurchase = (itemId: string, price: number, type: 'title' | 'item') => {
    if (points >= price) {
      setPoints(prev => prev - price);
      addPointTransaction('spend', price, type === 'title' ? `칭호 구매: ${itemId}` : `아이템 구매: ${itemId}`);
      
      if (type === 'title') {
        setOwnedTitles(prev => [...prev, itemId]);
      } else {
        setOwnedItems(prev => [...prev, itemId]);
      }

      // 첫 구매 업적 체크
      const currentProgress = achievementProgress['shop_purchase'] || 0;
      if (currentProgress === 0) {
        setAchievementProgress(prev => ({ ...prev, shop_purchase: 1 }));
        checkAndCompleteAchievement('shop_purchase');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsSideMenuOpen(false);
  };

  // 업적 체크 함수
  const checkAchievements = () => {
    // 내가 작성한 제보 수
    const myReportsCount = reports.filter(r => r.author.nickname === currentUser?.nickname).length;
    
    // 내가 작성한 모든 댓글 수
    const myCommentsCount = reports.reduce((total, report) => {
      return total + (report.comments?.filter(c => c.author.nickname === currentUser?.nickname).length || 0);
    }, 0);
    
    // 내 제보들이 받은 총 공감 수
    const totalLikesReceived = reports
      .filter(r => r.author.nickname === currentUser?.nickname)
      .reduce((sum, r) => sum + r.likes, 0);
    
    // 내가 누른 공감 수
    const giveLikesCount = likedReports.size;
    
    // 즐겨찾기 수
    const bookmarksCount = bookmarkedReports.size;
    
    // 구매한 아이템 수
    const purchasedItemsCount = ownedItems.length;
    
    // 장착한 아이템 수
    const equippedItemsCount = equippedItems.length;

    // 진행도 업데이트
    const newProgress: Record<string, number> = {
      first_report: myReportsCount,
      reports_5: myReportsCount,
      reports_10: myReportsCount,
      reports_20: myReportsCount,
      first_comment: myCommentsCount,
      comments_10: myCommentsCount,
      comments_30: myCommentsCount,
      likes_10: totalLikesReceived,
      likes_50: totalLikesReceived,
      likes_100: totalLikesReceived,
      give_likes_20: giveLikesCount,
      bookmarks_5: bookmarksCount,
      shop_purchase: purchasedItemsCount,
      profile_custom: equippedItemsCount,
    };

    setAchievementProgress(newProgress);

    // 새로 달성한 업적 체크
    const newlyCompleted: string[] = [];
    achievements.forEach(achievement => {
      const progress = newProgress[achievement.id] || 0;
      const isAlreadyCompleted = completedAchievements.has(achievement.id);
      
      if (!isAlreadyCompleted && progress >= achievement.requirement) {
        newlyCompleted.push(achievement.id);
        setCompletedAchievements(prev => new Set([...prev, achievement.id]));
        setPoints(prev => prev + achievement.points);
        
        // 토스트 알림
        toast.success(`🎉 업적 달성!`, {
          description: `"${achievement.title}" - ${achievement.points}P 획득!`,
          duration: 4000,
        });
      }
    });
  };

  // 관련 상태 변경 시 업적 체크
  useEffect(() => {
    if (currentUser) {
      checkAchievements();
    }
  }, [reports, likedReports, bookmarkedReports, ownedItems, equippedItems]);

  const handleSubmitReport = () => {
    if (!newReportTitle.trim() || !newReportPosition || !newReportContent.trim()) {
      alert('제목, 지도 위치, 내용을 모두 입력해주세요.');
      return;
    }
    
    if (!currentUser) return;
    
    // 새 ID 생성 (가장 큰 ID + 1)
    const newId = Math.max(...reports.map(r => parseInt(r.id))) + 1;
    
    const locationText = newReportDetailAddress.trim() 
      ? `${newReportLocation} - ${newReportDetailAddress}` 
      : newReportLocation;
    
    // 새 제보 객체 생성
    const newReport: Report = {
      id: newId.toString(),
      title: newReportTitle,
      location: locationText,
      content: newReportContent,
      image: newReportImage || undefined,
      likes: 0,
      commentCount: 0,
      comments: [],
      timestamp: '방금 전',
      status: 'inconvenient' as ReportStatus,
      author: {
        nickname: currentUser.nickname,
        character: currentUser.character,
        equippedItems: [...equippedItems],
      },
      position: newReportPosition,
    };
    
    // 리포트 목록에 추가 (맨 앞에 추가)
    setReports([newReport, ...reports]);
    
    // 제보 작성 포인트 지급 및 히스토리 추가
    setPoints(prev => prev + 10);
    addPointTransaction('earn', 10, '제보 작성');
    toast.success('제보가 등록되었습니다!', {
      description: '+10P 획득',
    });
    
    alert(`제보가 성공적으로 등록되었습니다!\n위치: ${locationText}`);
    
    // 폼 초기화
    setNewReportTitle('');
    setNewReportLocation('');
    setNewReportDetailAddress('');
    setNewReportPosition(null);
    setNewReportContent('');
    setNewReportImage('');
    setImageUploadMethod(null);
    setIsWriteDialogOpen(false);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReportImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (!selectedReport) return;
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    const updatedComments = selectedReport.comments?.filter(c => c.id !== commentId) || [];
    const updatedReport = {
      ...selectedReport,
      comments: updatedComments,
      commentCount: updatedComments.length,
    };

    setReports(prev => prev.map(r => 
      r.id === selectedReport.id ? updatedReport : r
    ));
    setSelectedReport(updatedReport);
  };

  const handleDeleteReport = () => {
    if (!selectedReport) return;
    if (!confirm('이 제보를 삭제하시겠습니까?')) return;

    setReports(prev => prev.filter(r => r.id !== selectedReport.id));
    setSelectedReport(null);
  };

  const handleEditReport = () => {
    if (!selectedReport) return;
    setEditReportTitle(selectedReport.title);
    setEditReportContent(selectedReport.content);
    setEditReportImage(selectedReport.image || '');
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    if (!selectedReport) return;
    if (!editReportTitle.trim() || !editReportContent.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const updatedReport = {
      ...selectedReport,
      title: editReportTitle,
      content: editReportContent,
      image: editReportImage || undefined,
    };

    setReports(prev => prev.map(r => 
      r.id === selectedReport.id ? updatedReport : r
    ));
    setSelectedReport(updatedReport);
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditReportTitle('');
    setEditReportContent('');
    setEditReportImage('');
  };

  // Show login screen if not logged in
  if (!isLoggedIn || !currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50"
      style={{ fontSize: `${settings.fontSize}%` }}
    >
      <Toaster />
      
      {/* Side Menu */}
      <SideMenu 
        open={isSideMenuOpen}
        onOpenChange={setIsSideMenuOpen}
        user={currentUser}
        onLogout={handleLogout}
        onMyPageClick={() => setIsMyPageOpen(true)}
        onShopClick={() => setIsShopOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        equippedItems={equippedItems}
      />

      {/* My Page */}
      <MyPage
        open={isMyPageOpen}
        onOpenChange={setIsMyPageOpen}
        currentTitle={currentTitle}
        onTitleChange={handleTitleChange}
        equippedItems={equippedItems}
        onEquipItem={handleEquipItem}
        onUnequipItem={handleUnequipItem}
        ownedTitles={ownedTitles}
        ownedItems={ownedItems}
        points={points}
        pointHistory={pointHistory}
        rankingUsers={[
          {
            id: 'user1',
            nickname: currentUser?.nickname || '차차',
            title: currentTitle,
            points: points,
            reportsCount: reports.filter(r => r.author.nickname === currentUser?.nickname).length,
            commentsCount: reports.reduce((total, report) => {
              return total + (report.comments?.filter(c => c.author.nickname === currentUser?.nickname).length || 0);
            }, 0),
            likesReceived: reports
              .filter(r => r.author.nickname === currentUser?.nickname)
              .reduce((sum, r) => sum + r.likes, 0),
          },
          { id: 'user2', nickname: '똑똑한 차차', title: 'title_expert', points: 2450, reportsCount: 15, commentsCount: 28, likesReceived: 142 },
          { id: 'user3', nickname: '공감왕 차차', title: 'title_king', points: 3100, reportsCount: 12, commentsCount: 35, likesReceived: 198 },
          { id: 'user4', nickname: '인기인 차차', title: 'title_popular', points: 1880, reportsCount: 8, commentsCount: 22, likesReceived: 95 },
          { id: 'user5', nickname: '캠퍼스 지킴이 차차', title: 'title_guardian', points: 2750, reportsCount: 21, commentsCount: 41, likesReceived: 167 },
        ]}
        currentUserId="user1"
      />

      {/* Shop Page */}
      <ShopPage
        open={isShopOpen}
        onOpenChange={setIsShopOpen}
        points={points}
        onPurchase={handlePurchase}
        ownedTitles={ownedTitles}
        ownedItems={ownedItems}
        onNavigateToMyPage={() => {
          setIsShopOpen(false);
          setIsMyPageOpen(true);
        }}
        achievements={achievements}
        completedAchievements={completedAchievements}
        achievementProgress={achievementProgress}
      />

      {/* Settings Page */}
      <SettingsPage
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        settings={settings}
        onSettingChange={handleSettingChange}
      />

      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setIsSideMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-base sm:text-lg font-bold">충남대학교 시설/불편 제보</h1>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsWriteDialogOpen(true)}
                className="relative"
              >
                <Plus className="w-5 h-5" />
              </Button>
              <NotificationPanel 
                notifications={notifications}
                reports={reports}
                onNotificationClick={handleNotificationClick}
                onMarkAllRead={handleMarkAllRead}
                open={isNotificationOpen}
                onOpenChange={setIsNotificationOpen}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Trending Report Billboard */}
        <TrendingReports reports={reports} onReportClick={handlePinClick} />

        {/* Campus Map */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">캠퍼스 지도</h2>
            <p className="text-sm text-gray-600">
              총 <span className="font-bold text-blue-600">{reports.length}</span>건의 제보
            </p>
          </div>
          <ReportMap reports={reports} onPinClick={handlePinClick} />
        </div>

        {/* Report List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">전체 제보</h2>
              <p className="text-sm text-gray-600">
                총 <span className="font-bold text-blue-600">{mockReports.length}</span>건
              </p>
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-32">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="likes">공감순</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentReports.map((report) => (
              <ReportCard 
                key={report.id} 
                report={report}
                onCommentClick={() => handlePinClick(report)}
                isLiked={likedReports.has(report.id)}
                isBookmarked={bookmarkedReports.has(report.id)}
                onToggleLike={handleToggleLike}
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg border shadow-sm">
              {/* 페이지 정보 */}
              <div className="text-sm text-gray-600">
                페이지 <span className="font-bold text-blue-600">{currentPage}</span> / {totalPages}
                <span className="ml-3">
                  ({startIndex + 1}-{Math.min(endIndex, sortedReports.length)} / {sortedReports.length}건)
                </span>
              </div>

              {/* 페이지 네비게이션 버튼 */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="w-9 h-9 p-0"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-9 h-9 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                {/* 페이지 번호 버튼들 */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-9 h-9 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 p-0"
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>

              {/* 페이지 직접 입력 */}
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="페이지"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handlePageInputSubmit();
                    }
                  }}
                  className="w-20 h-9"
                  min={1}
                  max={totalPages}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePageInputSubmit}
                  className="h-9"
                >
                  이동
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="font-bold mb-3">제보 안내</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• 캠퍼스 내 시설 관련 불편사항을 제보해주세요.</li>
            <li>• 공감 버튼으로 중요도를 표시할 수 있습니다.</li>
            <li>• 지도의 핀 색상은 공감수에 따라 변경됩니다.</li>
            <li>• 허위 제보나 부적절한 내용은 관리자에 의해 삭제될 수 있습니다.</li>
          </ul>
        </div>
      </main>

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => {
        if (!open) {
          setSelectedReport(null);
          if (openedFromNotification) {
            setOpenedFromNotification(false);
            setIsNotificationOpen(true);
          }
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{isEditMode ? '제보 수정' : '제보 상세'}</span>
              <div className="flex items-center gap-2">
                {isAdminMode && (
                  <Badge variant="default" className="gap-1">
                    <Shield className="w-3 h-3" />
                    관리자 모드
                  </Badge>
                )}
                {!isEditMode && selectedReport && currentUser && 
                  selectedReport.author.nickname === currentUser.nickname && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditReport}
                    >
                      수정
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeleteReport}
                      className="text-red-600 hover:text-red-700"
                    >
                      삭제
                    </Button>
                  </div>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              {isEditMode ? (
                <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                  <div>
                    <Label>제목</Label>
                    <Input
                      value={editReportTitle}
                      onChange={(e) => setEditReportTitle(e.target.value)}
                      placeholder="제목을 입력하세요"
                    />
                  </div>
                  <div>
                    <Label>내용</Label>
                    <Textarea
                      value={editReportContent}
                      onChange={(e) => setEditReportContent(e.target.value)}
                      placeholder="내용을 입력하세요"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label>이미지 URL (선택)</Label>
                    <Input
                      value={editReportImage}
                      onChange={(e) => setEditReportImage(e.target.value)}
                      placeholder="이미지 URL을 입력하세요"
                    />
                  </div>
                  {editReportImage && (
                    <div className="rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={editReportImage}
                        alt="미리보기"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} className="flex-1">
                      저장
                    </Button>
                    <Button 
                      onClick={handleCancelEdit} 
                      variant="outline"
                      className="flex-1"
                    >
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <ReportCard 
                  report={{ ...selectedReport, status: reportStatus }}
                  isLiked={likedReports.has(selectedReport.id)}
                  isBookmarked={bookmarkedReports.has(selectedReport.id)}
                  onToggleLike={handleToggleLike}
                  onToggleBookmark={handleToggleBookmark}
                />
              )}
              
              {/* Admin Status Control */}
              {!isEditMode && isAdminMode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-medium mb-2">상태 변경</label>
                  <Select value={reportStatus} onValueChange={(value) => handleStatusChange(value as ReportStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inconvenient">불편해요</SelectItem>
                      <SelectItem value="received">문제 접수</SelectItem>
                      <SelectItem value="in_progress">해결 중</SelectItem>
                      <SelectItem value="resolved">해결 완료</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    <Badge 
                      variant="outline" 
                      className={statusConfig[reportStatus].color}
                    >
                      현재 상태: {statusConfig[reportStatus].label}
                    </Badge>
                  </div>
                </div>
              )}
              
              {!isEditMode && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">댓글 {selectedReport.commentCount}개</h4>
                <div className="space-y-3">
                  {selectedReport.commentCount === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">아직 댓글이 없습니다.</p>
                  )}
                  
                  {selectedReport.comments && selectedReport.comments.map((comment) => (
                    <div 
                      key={comment.id} 
                      className={`rounded-lg p-3 ${
                        comment.isAdmin 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {comment.isAdmin ? (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm bg-blue-500">
                            관
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                            <img 
                              src={chachaImage} 
                              alt="차차" 
                              className="w-6 h-6 object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm">{comment.author.nickname}</p>
                              {comment.isAdmin && (
                                <Badge variant="outline" className="text-xs">관리자</Badge>
                              )}
                            </div>
                            {currentUser && comment.author.nickname === currentUser.nickname && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-xs text-red-600 hover:text-red-700 h-auto py-1"
                              >
                                삭제
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                          <span className="text-xs text-gray-500 mt-1 inline-block">{comment.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment Input for all users */}
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    {isAdminMode ? (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm bg-blue-500">
                        관
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                        <img 
                          src={chachaImage} 
                          alt="차차" 
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <Textarea 
                        placeholder="댓글을 입력하세요..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[60px]"
                      />
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          if (!newComment.trim()) {
                            alert('댓글 내용을 입력해주세요.');
                            return;
                          }
                          
                          if (!selectedReport || !currentUser) return;
                          
                          const newCommentObj: Comment = {
                            id: `c${Date.now()}`,
                            author: {
                              nickname: currentUser.nickname,
                              character: currentUser.character,
                            },
                            content: newComment,
                            timestamp: '방금 전',
                            isAdmin: isAdminMode,
                          };
                          
                          const updatedReport = {
                            ...selectedReport,
                            comments: [...(selectedReport.comments || []), newCommentObj],
                            commentCount: (selectedReport.comments?.length || 0) + 1,
                          };
                          
                          setReports(prev => prev.map(r => 
                            r.id === selectedReport.id ? updatedReport : r
                          ));
                          
                          setSelectedReport(updatedReport);
                          setNewComment('');
                          
                          // 댓글 작성 포인트 지급 및 히스토리 추가
                          setPoints(prev => prev + 5);
                          addPointTransaction('earn', 5, '댓글 작성');
                          toast.success('댓글이 작성되었습니다!', {
                            description: '+5P 획득',
                          });
                        }}
                      >
                        댓글 작성
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Write Report Dialog */}
      <Dialog open={isWriteDialogOpen} onOpenChange={setIsWriteDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-6" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>새 제보 작성</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto pr-2 flex-1">
            <div>
              <Label htmlFor="report-title">제목</Label>
              <Input
                id="report-title"
                placeholder="제목을 입력하세요"
                value={newReportTitle}
                onChange={(e) => setNewReportTitle(e.target.value)}
              />
            </div>
            
            <div>
              <Label>장소 선택 *</Label>
              <LocationPickerMap 
                selectedPosition={newReportPosition}
                onSelectPosition={(pos) => {
                  setNewReportPosition(pos);
                  setNewReportLocation(`위도: ${pos.y.toFixed(1)}%, 경도: ${pos.x.toFixed(1)}%`);
                }}
              />
              {newReportPosition && (
                <p className="text-xs text-gray-600 mt-2">
                  선택된 위치: {newReportLocation}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="report-detail-address">상세 주소 (선택)</Label>
              <Input
                id="report-detail-address"
                placeholder="예: 3층 화장실, 201호 강의실"
                value={newReportDetailAddress}
                onChange={(e) => setNewReportDetailAddress(e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="report-content">내용</Label>
                <Select onValueChange={(value) => {
                  if (value) {
                    setNewReportContent(value);
                  }
                }}>
                  <SelectTrigger className="w-[200px] h-8">
                    <SelectValue placeholder="📌 템플릿 불러오기" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="화장실 변기가 막혀서 사용이 불가능합니다. 빠른 조치 부탁드립니다.">🚽 화장실 변기 막힘</SelectItem>
                    <SelectItem value="화장실 수도에서 물이 나오지 않습니다. 확인 부탁드립니다.">🚰 화장실 수도 고장</SelectItem>
                    <SelectItem value="에어컨/난방이 작동하지 않아 실내 온도가 매우 불쾌합니다.">❄️ 에어컨/냉난방 고장</SelectItem>
                    <SelectItem value="조명이 깜빡이거나 켜지지 않아 어둡습니다. 교체가 필요합니다.">💡 조명 고장</SelectItem>
                    <SelectItem value="빔프로젝터가 제대로 작동하지 않아 수업/발표에 지장이 ��습니다.">📽️ 빔프로젝터 불량</SelectItem>
                    <SelectItem value="책상/의자가 파손되어 사용이 불편하거나 위험합니다.">🪑 책상/의자 파손</SelectItem>
                    <SelectItem value="바닥이나 벽에 균열이 생겨 안전에 문제가 있을 수 있습니다.">⚠️ 바닥/벽 균열</SelectItem>
                    <SelectItem value="과도한 소음으로 인해 학습/업무에 집중하기 어렵습니다.">🔊 소음 문제</SelectItem>
                    <SelectItem value="청소가 제대로 되지 않아 위생 상태가 좋지 않습니다.">🧹 청소 미흡</SelectItem>
                    <SelectItem value="악취가 심해서 해당 공간을 사용하기 어렵습니다.">😷 악취 문제</SelectItem>
                    <SelectItem value="엘리베이터가 고장나서 이동에 큰 불편이 있습니다.">🛗 엘리베이터 고장</SelectItem>
                    <SelectItem value="와이파이가 연결되지 않거나 속도가 매우 느립니다.">📶 와이파이 연결 불량</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                id="report-content"
                placeholder="불편사항을 자세히 설명해주세요 (위에서 템플릿을 선택하거나 직접 입력)"
                value={newReportContent}
                onChange={(e) => setNewReportContent(e.target.value)}
                className="min-h-32"
              />
            </div>
            
            <div>
              <Label>사진 (선택)</Label>
              {!newReportImage ? (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">갤러리</span>
                        <span className="text-xs text-gray-500">사진 선택</span>
                      </div>
                    </div>
                  </label>
                  
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <Camera className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">카메라</span>
                        <span className="text-xs text-gray-500">사진 촬영</span>
                      </div>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="mt-2 relative">
                  <ImageWithFallback
                    src={newReportImage}
                    alt="미리보기"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setNewReportImage('')}
                  >
                    삭제
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsWriteDialogOpen(false)}
              >
                취소
              </Button>
              <Button onClick={handleSubmitReport}>
                제보하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Expansion Dialog */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg 
                className="w-8 h-8" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
            <ImageWithFallback 
              src={expandedImage.src}
              alt={expandedImage.alt}
              className="w-full h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-white text-center mt-4 text-sm">{expandedImage.alt}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              © 2025 충남대학교 시설관리팀. 모든 제보는 검토 후 처리됩니다.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
