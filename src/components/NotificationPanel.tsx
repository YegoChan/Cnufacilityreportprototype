import { Bell, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Report } from './ReportCard';

interface Notification {
  id: string;
  type: 'resolved' | 'liked_resolved' | 'trending';
  title: string;
  message: string;
  reportId: string;
  timestamp: string;
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  reports: Report[];
  onNotificationClick: (reportId: string) => void;
  onMarkAllRead: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NotificationPanel({ 
  notifications, 
  reports,
  onNotificationClick,
  onMarkAllRead,
  open,
  onOpenChange
}: NotificationPanelProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'liked_resolved':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'trending':
        return <TrendingUp className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative" aria-label="알림">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" side="bottom">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">알림</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-auto p-1"
              onClick={onMarkAllRead}
            >
              모두 읽음
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p className="text-sm">새로운 알림이 없습니다</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => onNotificationClick(notification.reportId)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm mb-1">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-400">
                        {notification.timestamp}
                      </span>
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
