import { useState, useEffect } from 'react';
import { Report } from './ReportCard';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { TrendingUp, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Badge } from './ui/badge';
import { items } from './MyPage';

interface TrendingReportsProps {
  reports: Report[];
  onReportClick: (report: Report) => void;
}

const statusConfig = {
  inconvenient: { label: '불편해요', color: 'bg-red-100 text-red-700 border-red-200' },
  received: { label: '문제 접수', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  in_progress: { label: '해결 중', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  resolved: { label: '해결 완료', color: 'bg-green-100 text-green-700 border-green-200' },
};

export function TrendingReports({ reports, onReportClick }: TrendingReportsProps) {
  // Sort by likes to get trending reports
  const trendingReports = [...reports]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingReports.length);
    }, 5000); // 5초마다 변경

    return () => clearInterval(interval);
  }, [trendingReports.length]);

  const currentReport = trendingReports[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + trendingReports.length) % trendingReports.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % trendingReports.length);
  };

  if (!currentReport) return null;

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 shadow-lg border-2 border-orange-200">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold">지금 뜨는 불편함</h2>
      </div>
      
      <div 
        className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onReportClick(currentReport)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center relative overflow-visible">
              <img 
                src="/chacha.png" 
                alt="차차" 
                className="w-8 h-8 object-contain"
              />
              {/* 장착된 아이템 표시 */}
              {currentReport.author.equippedItems && currentReport.author.equippedItems.length > 0 && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                  {currentReport.author.equippedItems.map((itemId) => {
                    const item = items.find(i => i.id === itemId);
                    if (!item) return null;
                    
                    // 아이템 위치 조정 (작은 사이즈용)
                    let positionClass = '';
                    if (item.type === 'hat') positionClass = 'top-1.5';
                    else if (item.type === 'glasses') positionClass = 'top-2';
                    else if (item.type === 'face') positionClass = 'top-3';
                    else if (item.type === 'neck') positionClass = 'top-4';
                    
                    return (
                      <div 
                        key={itemId}
                        className={`absolute ${positionClass}`}
                      >
                        {item.layer ? (
                          <img 
                            src={item.layer} 
                            alt={item.name} 
                            className="w-8 h-8 object-contain" 
                          />
                        ) : item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-8 h-8 object-contain" 
                          />
                        ) : (
                          <span className="text-sm">{item.emoji}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{currentReport.author.nickname}</p>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <MapPin className="w-3 h-3" />
                <span>{currentReport.location}</span>
              </div>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={statusConfig[currentReport.status].color}
          >
            {statusConfig[currentReport.status].label}
          </Badge>
        </div>

        <h3 className="font-semibold text-lg mb-2">{currentReport.title}</h3>
        <p className="text-gray-700 line-clamp-2">{currentReport.content}</p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>❤️ {currentReport.likes}</span>
            <span>💬 {currentReport.commentCount}</span>
          </div>
          <span className="text-xs text-gray-400">{currentReport.timestamp}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <Button variant="ghost" size="sm" onClick={handlePrev}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          {trendingReports.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={handleNext}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}