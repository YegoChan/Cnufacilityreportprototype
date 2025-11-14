import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Bell, Moon, Eye, Map, Type, Globe, LogIn } from 'lucide-react';

interface SettingsPageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: {
    pushNotifications: boolean;
    notifyOnComment: boolean;
    notifyOnLike: boolean;
    notifyOnStatusChange: boolean;
    darkMode: boolean;
    hideResolvedReports: boolean;
    autoLocationTracking: boolean;
    fontSize: number;
    language: string;
    autoLogin: boolean;
  };
  onSettingChange: (key: string, value: any) => void;
}

export function SettingsPage({ open, onOpenChange, settings, onSettingChange }: SettingsPageProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>환경설정</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 알림 설정 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">알림 설정</h3>
            </div>
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">푸시 알림</Label>
                  <p className="text-sm text-gray-500">모든 푸시 알림 활성화</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => onSettingChange('pushNotifications', checked)}
                />
              </div>

              {settings.pushNotifications && (
                <div className="ml-6 space-y-4 pt-2 border-l-2 border-gray-200 pl-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-comment">댓글 알림</Label>
                      <p className="text-sm text-gray-500">내 제보에 댓글이 달렸을 때</p>
                    </div>
                    <Switch
                      id="notify-comment"
                      checked={settings.notifyOnComment}
                      onCheckedChange={(checked) => onSettingChange('notifyOnComment', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-like">공감 알림</Label>
                      <p className="text-sm text-gray-500">내 제보에 공감을 받았을 때</p>
                    </div>
                    <Switch
                      id="notify-like"
                      checked={settings.notifyOnLike}
                      onCheckedChange={(checked) => onSettingChange('notifyOnLike', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-status">상태 변경 알림</Label>
                      <p className="text-sm text-gray-500">제보 처리 상태가 변경되었을 때</p>
                    </div>
                    <Switch
                      id="notify-status"
                      checked={settings.notifyOnStatusChange}
                      onCheckedChange={(checked) => onSettingChange('notifyOnStatusChange', checked)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 화면 설정 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">화면 설정</h3>
            </div>
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">다크 모드</Label>
                  <p className="text-sm text-gray-500">어두운 테마 사용</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => onSettingChange('darkMode', checked)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="font-size">글자 크기</Label>
                  <span className="text-sm text-gray-500">{settings.fontSize}%</span>
                </div>
                <div className="flex items-center gap-4">
                  <Type className="w-4 h-4 text-gray-400" />
                  <Slider
                    id="font-size"
                    min={80}
                    max={120}
                    step={10}
                    value={[settings.fontSize]}
                    onValueChange={(value) => onSettingChange('fontSize', value[0])}
                    className="flex-1"
                  />
                  <Type className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* 제보 설정 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">제보 설정</h3>
            </div>
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hide-resolved">해결된 제보 숨기기</Label>
                  <p className="text-sm text-gray-500">해결 완료된 제보를 목록에서 숨김</p>
                </div>
                <Switch
                  id="hide-resolved"
                  checked={settings.hideResolvedReports}
                  onCheckedChange={(checked) => onSettingChange('hideResolvedReports', checked)}
                />
              </div>
            </div>
          </div>

          {/* 지도 설정 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">지도 설정</h3>
            </div>
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-location">자동 위치 추적</Label>
                  <p className="text-sm text-gray-500">지도를 열 때 현재 위치로 이동</p>
                </div>
                <Switch
                  id="auto-location"
                  checked={settings.autoLocationTracking}
                  onCheckedChange={(checked) => onSettingChange('autoLocationTracking', checked)}
                />
              </div>
            </div>
          </div>

          {/* 언어 및 기타 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">언어 및 기타</h3>
            </div>
            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">언어</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => onSettingChange('language', value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="언어 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ko">한국어</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-login">자동 로그인</Label>
                  <p className="text-sm text-gray-500">다음에 자동으로 로그인</p>
                </div>
                <Switch
                  id="auto-login"
                  checked={settings.autoLogin}
                  onCheckedChange={(checked) => onSettingChange('autoLogin', checked)}
                />
              </div>
            </div>
          </div>

          {/* 앱 정보 */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">버전</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">개발</span>
              <span>충남대학교</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
