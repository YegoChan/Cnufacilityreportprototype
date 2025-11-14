import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Coins, ShoppingCart, Check, Lock, User } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from './ui/alert-dialog';
import { items } from './MyPage';
import { AchievementsTab, Achievement } from './AchievementsTab';

interface ShopPageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  points: number;
  onPurchase: (itemId: string, price: number, type: 'title' | 'item') => void;
  ownedTitles: string[];
  ownedItems: string[];
  onNavigateToMyPage: () => void;
  achievements: Achievement[];
  completedAchievements: Set<string>;
  achievementProgress: Record<string, number>;
}

// 상점에서 판매하는 칭호 목록 (가격 포함) - 업적 칭호와 별개의 상점 전용 칭호
const shopTitles = [
  { id: 'fashionista', name: '패션왕', description: '스타일리시한 당신', price: 300 },
  { id: 'shining', name: '빛나는', description: '반짝반짝 빛나요', price: 250 },
  { id: 'gold_member', name: '골드 멤버', description: '고급진 느낌', price: 500 },
  { id: 'vip', name: 'VIP', description: 'Very Important Person', price: 600 },
  { id: 'luxury', name: '럭셔리', description: '고급스러운 분위기', price: 700 },
  { id: 'elite', name: '엘리트', description: '선택받은 사람', price: 800 },
  { id: 'premium', name: '프리미엄', description: '특별한 당신', price: 900 },
  { id: 'special', name: '스페셜', description: '특별 에디션', price: 400 },
  { id: 'unique', name: '유니크', description: '세상에 하나뿐인', price: 450 },
  { id: 'trendy', name: '트렌디', description: '유행을 선도하는', price: 350 },
  { id: 'cool', name: '쿨한', description: '시크하고 멋진', price: 300 },
  { id: 'smart', name: '똑똑한', description: '지혜로운 선택', price: 400 },
  { id: 'cute', name: '귀여운', description: '사랑스러운 매력', price: 250 },
  { id: 'energetic', name: '에너제틱', description: '활기찬 에너지', price: 350 },
  { id: 'legendary', name: '전설의', description: '신화가 된', price: 1500 },
];

// 상점에서 판매하는 아이템 목록 (가격 포함)
const shopItems = [
  { ...items.find(i => i.id === 'straw_hat')!, price: 200 },
  { ...items.find(i => i.id === 'party_hat')!, price: 250 },
  { ...items.find(i => i.id === 'crown')!, price: 500 },
  { ...items.find(i => i.id === 'sunglasses')!, price: 300 },
  { ...items.find(i => i.id === 'mask')!, price: 300 },
  { ...items.find(i => i.id === 'bow')!, price: 300 },
];

// 카테고리 ���록
const categories = ['모자', '안경', '얼굴', '목걸이'];

export function ShopPage({
  open,
  onOpenChange,
  points,
  onPurchase,
  ownedTitles,
  ownedItems,
  onNavigateToMyPage,
  achievements,
  completedAchievements,
  achievementProgress,
}: ShopPageProps) {
  const [activeTab, setActiveTab] = useState('achievements');
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
    price: number;
    type: 'title' | 'item';
  } | null>(null);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
  const [purchasedItemName, setPurchasedItemName] = useState('');

  const handleItemClick = (id: string, name: string, price: number, type: 'title' | 'item') => {
    setSelectedItem({ id, name, price, type });
  };

  const handlePurchase = () => {
    if (selectedItem) {
      // 포인트가 충분한지 확인
      if (points >= selectedItem.price) {
        onPurchase(selectedItem.id, selectedItem.price, selectedItem.type);
        setPurchasedItemName(selectedItem.name);
        setSelectedItem(null);
        setShowPurchaseSuccess(true);
      } else {
        // 포인트 부족 시 다이얼로그만 닫기
        setSelectedItem(null);
      }
    }
  };

  const handleGoToMyPage = () => {
    setShowPurchaseSuccess(false);
    onNavigateToMyPage();
  };

  const isOwned = (id: string, type: 'title' | 'item') => {
    if (type === 'title') {
      return ownedTitles.includes(id);
    } else {
      return ownedItems.includes(id);
    }
  };

  const canAfford = (price: number) => {
    return points >= price;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>상점</DialogTitle>
          </DialogHeader>
          
          {/* 마이페이지 버튼 - 별도 영역 */}
          <div className="flex justify-end -mt-2 mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onNavigateToMyPage}
              className="gap-2"
            >
              <User className="w-4 h-4" />
              마이페이지
            </Button>
          </div>

          <div className="space-y-6">
            {/* 포인트 표시 */}
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
              <Coins className="w-6 h-6 text-yellow-600" />
              <div className="text-center">
                <p className="text-sm text-gray-600">보유 포인트</p>
                <p className="text-2xl font-bold text-yellow-600">{points.toLocaleString()}P</p>
              </div>
            </div>

            {/* 탭 메뉴 */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="achievements">업적</TabsTrigger>
                <TabsTrigger value="titles">칭호</TabsTrigger>
                <TabsTrigger value="items">아이템</TabsTrigger>
              </TabsList>

              {/* 업적 탭 */}
              <TabsContent value="achievements">
                <AchievementsTab
                  achievements={achievements}
                  completedAchievements={completedAchievements}
                  progress={achievementProgress}
                />
              </TabsContent>

              {/* 칭호 탭 */}
              <TabsContent value="titles" className="space-y-3 mt-4">
                <div className="grid gap-3">
                  {shopTitles.map((title) => {
                    const owned = isOwned(title.id, 'title');
                    const affordable = canAfford(title.price);
                    
                    return (
                      <button
                        key={title.id}
                        onClick={() => !owned && handleItemClick(title.id, title.name, title.price, 'title')}
                        disabled={owned}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          owned
                            ? 'border-green-200 bg-green-50 opacity-60 cursor-default'
                            : affordable
                            ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{title.name}</span>
                              {owned && (
                                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                                  <Check className="w-3 h-3 mr-1" />
                                  보유중
                                </Badge>
                              )}
                              {!owned && !affordable && (
                                <Lock className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{title.description}</p>
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            <Coins className="w-4 h-4 text-yellow-600" />
                            <span className={`font-bold ${affordable || owned ? 'text-yellow-600' : 'text-gray-400'}`}>
                              {title.price}P
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </TabsContent>

              {/* 아이템 탭 */}
              <TabsContent value="items" className="space-y-4 mt-4">
                {categories.map((category) => {
                  const categoryItems = shopItems.filter(item => item.category === category);
                  if (categoryItems.length === 0) return null;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <h3 className="font-semibold text-sm text-gray-600 px-2">{category}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {categoryItems.map((item) => {
                          const owned = isOwned(item.id, 'item');
                          const affordable = canAfford(item.price);
                          
                          return (
                            <button
                              key={item.id}
                              onClick={() => !owned && handleItemClick(item.id, item.name, item.price, 'item')}
                              disabled={owned}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                owned
                                  ? 'border-green-200 bg-green-50 opacity-60 cursor-default'
                                  : affordable
                                  ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                  : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <div className="flex flex-col items-center gap-2">
                                <div className="relative">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                                  ) : (
                                    <span className="text-4xl">{item.emoji}</span>
                                  )}
                                  {owned && (
                                    <div className="absolute -top-1 -right-1">
                                      <Check className="w-4 h-4 text-green-500 bg-white rounded-full" />
                                    </div>
                                  )}
                                  {!owned && !affordable && (
                                    <div className="absolute -top-1 -right-1">
                                      <Lock className="w-4 h-4 text-gray-400 bg-white rounded-full" />
                                    </div>
                                  )}
                                </div>
                                <div className="text-center w-full">
                                  <div className="font-semibold text-sm">{item.name}</div>
                                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                  <div className="flex items-center justify-center gap-1 mt-2">
                                    <Coins className="w-3 h-3 text-yellow-600" />
                                    <span className={`text-sm font-bold ${affordable || owned ? 'text-yellow-600' : 'text-gray-400'}`}>
                                      {item.price}P
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* 구매 확인 다이얼로그 */}
      <AlertDialog open={selectedItem !== null} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>구매 확인</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-lg font-semibold mb-2">{selectedItem?.name}</p>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Coins className="w-5 h-5 text-yellow-600" />
                    <span className="font-bold text-yellow-600">{selectedItem?.price}P</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">보유 포인트</span>
                    <span className="font-semibold">{points.toLocaleString()}P</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">결제 후 포인트</span>
                    <span className={`font-bold ${
                      selectedItem && points - selectedItem.price >= 0 
                        ? 'text-blue-600' 
                        : 'text-red-600'
                    }`}>
                      {selectedItem && (points - selectedItem.price).toLocaleString()}P
                    </span>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>더 둘러볼게요</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handlePurchase} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={selectedItem ? points < selectedItem.price : false}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {selectedItem && points < selectedItem.price ? '포인트 부족' : '살게요'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 구매 성공 다이얼로그 */}
      <AlertDialog open={showPurchaseSuccess} onOpenChange={setShowPurchaseSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>구매 완료! 🎉</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-lg font-semibold mb-2">{purchasedItemName}</p>
                  <p className="text-sm text-gray-600">구매가 완료되었습니다!</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-800">
                    마이페이지에서 구매한 {purchasedItemName}를 확인하고 사용해보세요!
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>계속 쇼핑할게요</AlertDialogCancel>
            <AlertDialogAction onClick={handleGoToMyPage} className="bg-blue-600 hover:bg-blue-700">
              <User className="w-4 h-4 mr-2" />
              마이페이지로 이동
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
