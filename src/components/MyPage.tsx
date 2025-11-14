import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Check, Trophy, Coins, User } from 'lucide-react';
import { PointHistory, PointTransaction } from './PointHistory';
import { RankingSystem, RankingUser } from './RankingSystem';

interface MyPageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTitle: string;
  onTitleChange: (title: string) => void;
  equippedItems: string[];
  onEquipItem: (itemId: string) => void;
  onUnequipItem: (itemId: string) => void;
  ownedTitles?: string[];
  ownedItems?: string[];
  points?: number;
  pointHistory?: PointTransaction[];
  rankingUsers?: RankingUser[];
  currentUserId?: string;
}

// 칭호 목록 (업적 칭호 + 상점 칭호)
const titles = [
  { id: 'none', name: '없음', description: '기본 칭호' },
  // 업적 칭호 (업적 보상으로 제공)
  { id: 'title_beginner', name: '새내기', description: '첫 제보 작성' },
  { id: 'title_reporter', name: '제보러', description: '제보 5개 작성' },
  { id: 'title_expert', name: '전문가', description: '제보 10개 작성' },
  { id: 'title_guardian', name: '캠퍼스 지킴이', description: '제보 20개 작성' },
  { id: 'title_chatterer', name: '수다쟁이', description: '첫 댓글 작성' },
  { id: 'title_talker', name: '말빨', description: '댓글 10개 작성' },
  { id: 'title_communicator', name: '소통왕', description: '댓글 30개 작성' },
  { id: 'title_liked', name: '인싸', description: '공감 10개 받기' },
  { id: 'title_popular', name: '인기인', description: '공감 50개 받기' },
  { id: 'title_king', name: '공감왕', description: '공감 100개 받기' },
  { id: 'title_supporter', name: '응원단', description: '다른 제보에 공감 20번' },
  { id: 'title_collector', name: '컬렉터', description: '즐겨찾기 5개 추가' },
  { id: 'title_shopper', name: '쇼핑왕', description: '상점에서 첫 구매' },
  { id: 'title_fashionista', name: '패셔니스타', description: '아이템 장착' },
  // 기존 칭호 (호환성 유지)
  { id: 'pro_complainer', name: '프로불편러', description: '제보 10개 이상 작성' },
  { id: 'picky', name: '불편한 것도 참 많은', description: '제보 5개 이상 작성' },
  { id: 'sensitive', name: '예민보스', description: '댓글 30개 이상 작성' },
  { id: 'detail_oriented', name: '디테일 장인', description: '상세한 제보 작성' },
  { id: 'campus_guardian', name: '캠퍼스 지킴이', description: '공감 100개 이상 받음' },
  { id: 'issue_hunter', name: '불편 사냥꾼', description: '다양한 위치 제보' },
  { id: 'complaint_master', name: '컴플레인 마스터', description: '제보 20개 이상 작성' },
  { id: 'legendary_complainer', name: '전설의 불평러', description: '모든 업적 달성' },
  { id: 'observant', name: '관찰력 갑', description: '숨은 불편함 발견' },
  { id: 'persistent', name: '끈질긴', description: '해결까지 추적' },
  // 상점 칭호
  { id: 'fashionista', name: '패션왕', description: '스타일리시한 당신' },
  { id: 'shining', name: '빛나는', description: '반짝반짝 빛나요' },
  { id: 'gold_member', name: '골드 멤버', description: '고급진 느낌' },
  { id: 'vip', name: 'VIP', description: 'Very Important Person' },
  { id: 'luxury', name: '럭셔리', description: '고급스러운 분위기' },
  { id: 'elite', name: '엘리트', description: '선택받은 사람' },
  { id: 'premium', name: '프리미엄', description: '특별한 당신' },
  { id: 'special', name: '스페셜', description: '특별 에디션' },
  { id: 'unique', name: '유니크', description: '세상에 하나뿐인' },
  { id: 'trendy', name: '트렌디', description: '유행을 선도하는' },
  { id: 'cool', name: '쿨한', description: '시크하고 멋진' },
  { id: 'smart', name: '똑똑한', description: '지혜로운 선택' },
  { id: 'cute', name: '귀여운', description: '사랑스러운 매력' },
  { id: 'energetic', name: '에너제틱', description: '활기찬 에너지' },
  { id: 'legendary', name: '전설의', description: '신화가 된' },
];

// 아이템 목록
export const items = [
  { id: 'straw_hat', name: '밀짚모자', emoji: '👒', type: 'hat', category: '모자', description: '멋진 밀짚모자' },
  { id: 'party_hat', name: '파티모자', emoji: '🥳', type: 'hat', category: '모자', description: '파티 분위기!' },
  { id: 'crown', name: '왕관', emoji: '👑', type: 'hat', category: '모자', description: '당신은 왕!' },
  { id: 'sunglasses', name: '선글라스', emoji: '🕶️', type: 'glasses', category: '안경', description: '쿨한 선글라스' },
  { id: 'mask', name: '마스크', emoji: '🎭', type: 'face', category: '얼굴', description: '건강 제일!' },
  { id: 'bow', name: '나비넥타이', emoji: '👔', type: 'neck', category: '목걸이', description: '정장 스타일' },
];

// 카테고리 목록
const categories = ['모자', '안경', '얼굴', '목걸이'];

export function MyPage({
  open,
  onOpenChange,
  currentTitle,
  onTitleChange,
  equippedItems,
  onEquipItem,
  onUnequipItem,
  ownedTitles = titles.map(t => t.id),
  ownedItems = items.map(i => i.id),
  points = 0,
  pointHistory = [],
  rankingUsers = [],
  currentUserId = '',
}: MyPageProps) {
  const [activeTab, setActiveTab] = useState('title');
  
  // 보유한 칭호와 아이템만 필터링
  const availableTitles = titles.filter(t => ownedTitles.includes(t.id));
  const availableItems = items.filter(i => ownedItems.includes(i.id));

  const isItemEquipped = (itemId: string) => {
    return equippedItems.includes(itemId);
  };

  const toggleItem = (itemId: string, itemType: string) => {
    if (isItemEquipped(itemId)) {
      onUnequipItem(itemId);
    } else {
      // 같은 타입의 아이템이 있으면 먼저 제거
      const sameTypeItem = items.find(
        item => item.type === itemType && isItemEquipped(item.id)
      );
      if (sameTypeItem) {
        onUnequipItem(sameTypeItem.id);
      }
      onEquipItem(itemId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>마이페이지</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 차차 캐릭터 표시 */}
          <div className="flex flex-col items-center py-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
            <div className="relative">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                <User className="w-28 h-28 text-blue-600" />
              </div>
              {/* 장착된 아이템 표시 */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                {equippedItems.map((itemId) => {
                  const item = items.find(i => i.id === itemId);
                  if (!item) return null;
                  
                  // 아이템 위치 조정
                  let positionClass = '';
                  if (item.type === 'hat') positionClass = 'top-0';
                  else if (item.type === 'glasses') positionClass = 'top-12';
                  else if (item.type === 'face') positionClass = 'top-16';
                  else if (item.type === 'neck') positionClass = 'top-24';
                  
                  return (
                    <div 
                      key={itemId}
                      className={`absolute ${positionClass}`}
                    >
                      <span className="text-4xl">{item.emoji}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* 현재 칭호 표시 */}
            {currentTitle !== 'none' && (
              <Badge className="mt-4 text-lg px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-500">
                {titles.find(t => t.id === currentTitle)?.name}
              </Badge>
            )}
          </div>

          {/* 탭 메뉴 */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="title">칭호</TabsTrigger>
              <TabsTrigger value="inventory">인벤토리</TabsTrigger>
              <TabsTrigger value="points">
                <Coins className="w-4 h-4 mr-1" />
                포인트
              </TabsTrigger>
              <TabsTrigger value="ranking">
                <Trophy className="w-4 h-4 mr-1" />
                랭킹
              </TabsTrigger>
            </TabsList>

            {/* 칭호 탭 */}
            <TabsContent value="title" className="space-y-3 mt-4">
              <div className="grid gap-3">
                {availableTitles.map((title) => (
                  <button
                    key={title.id}
                    onClick={() => onTitleChange(title.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      currentTitle === title.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{title.name}</span>
                          {currentTitle === title.id && (
                            <Check className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{title.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            {/* 인벤토리 탭 */}
            <TabsContent value="inventory" className="space-y-4 mt-4">
              {availableItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">보유한 아이템이 없습니다.</p>
                  <p className="text-sm text-gray-400 mt-2">상점에서 아이템을 구매해보세요!</p>
                </div>
              ) : (
                <>
                  {categories.map((category) => {
                    const categoryItems = availableItems.filter(item => item.category === category);
                    if (categoryItems.length === 0) return null;
                    return (
                  <div key={category} className="space-y-2">
                    <h3 className="font-semibold text-sm text-gray-600 px-2">{category}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {categoryItems.map((item) => {
                        const equipped = isItemEquipped(item.id);
                        return (
                          <button
                            key={item.id}
                            onClick={() => toggleItem(item.id, item.type)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              equipped
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                              ) : (
                                <span className="text-4xl">{item.emoji}</span>
                              )}
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <span className="font-semibold text-sm">{item.name}</span>
                                  {equipped && <Check className="w-3 h-3 text-green-500" />}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                      </div>
                    );
                  })}
                  <p className="text-sm text-gray-500 text-center mt-4">
                    아이템을 클릭하여 차차에게 착용시키세요!
                  </p>
                </>
              )}
            </TabsContent>

            {/* 포인트 히스토리 탭 */}
            <TabsContent value="points" className="mt-4">
              <PointHistory transactions={pointHistory} currentPoints={points} />
            </TabsContent>

            {/* 랭킹 탭 */}
            <TabsContent value="ranking" className="mt-4">
              <RankingSystem users={rankingUsers} currentUserId={currentUserId} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
