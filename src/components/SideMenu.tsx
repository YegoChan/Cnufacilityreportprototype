import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { User, Settings, LogOut, ShoppingBag } from 'lucide-react';
import { Separator } from './ui/separator';
import chachaImage from 'figma:asset/58a6df21cd2b1931395a1e589b5c4237d4dac6ee.png';
import strawHatLayer from 'figma:asset/2aecfd77b3d45ba095657cd7821f19cdee39f362.png';
import { items } from './MyPage';

interface SideMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    nickname: string;
    character: string;
    department: string;
  };
  onLogout: () => void;
  onMyPageClick: () => void;
  onShopClick: () => void;
  onSettingsClick: () => void;
  equippedItems: string[];
}

export function SideMenu({ open, onOpenChange, user, onLogout, onMyPageClick, onShopClick, onSettingsClick, equippedItems }: SideMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle>메뉴</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* User Profile Section */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center relative">
              <img 
                src={chachaImage} 
                alt="차차" 
                className="w-20 h-20 object-contain"
              />
              {/* 장착된 아이템 표시 */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                {equippedItems.map((itemId) => {
                  const item = items.find(i => i.id === itemId);
                  if (!item) return null;
                  
                  // 아이템 위치 조정 (SideMenu 작은 사이즈용)
                  let positionClass = '';
                  if (item.type === 'hat') positionClass = 'top-1';
                  else if (item.type === 'glasses') positionClass = 'top-6';
                  else if (item.type === 'face') positionClass = 'top-8';
                  else if (item.type === 'neck') positionClass = 'top-12';
                  
                  return (
                    <div 
                      key={itemId}
                      className={`absolute ${positionClass}`}
                    >
                      {item.image ? (
                        <img 
                          src={itemId === 'straw_hat' ? strawHatLayer : item.image} 
                          alt={item.name} 
                          className="w-20 h-20 object-contain" 
                        />
                      ) : (
                        <span className="text-2xl">{item.emoji}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="font-semibold text-lg">{user.nickname}</p>
              <p className="text-sm text-gray-500">충남대학교 {user.department} 학생</p>
            </div>
          </div>

          <Separator />

          {/* Menu Items */}
          <nav className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => {
                onMyPageClick();
                onOpenChange(false);
              }}
            >
              <User className="w-5 h-5" />
              <span>마이페이지</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => {
                onShopClick();
                onOpenChange(false);
              }}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>상점</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => {
                onSettingsClick();
                onOpenChange(false);
              }}
            >
              <Settings className="w-5 h-5" />
              <span>환경설정</span>
            </Button>
          </nav>

          <Separator />

          {/* Logout Button */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              onLogout();
              onOpenChange(false);
            }}
          >
            <LogOut className="w-5 h-5" />
            <span>로그아웃</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
