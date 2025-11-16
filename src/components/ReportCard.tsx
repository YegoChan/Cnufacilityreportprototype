import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Heart, MessageCircle, Bookmark } from 'lucide-react';
import { useState } from 'react';
import chachaImage from 'figma:asset/58a6df21cd2b1931395a1e589b5c4237d4dac6ee.png';
import strawHatLayer from 'figma:asset/2aecfd77b3d45ba095657cd7821f19cdee39f362.png';
import crownLayer from 'figma:asset/9aba21eef91e269ee33b1bca5c0326bdac3cca57.png';
import partyHatIcon from 'figma:asset/77ea7fbfe34c6f9d680d334a926446fa37ed721c.png';
import maskIcon from 'figma:asset/09f1d980a8e475b6bd9c26317c36658e30a56143.png';
import { items } from './MyPage';

export type ReportStatus = 'inconvenient' | 'received' | 'in_progress' | 'resolved';

export interface Comment {
  id: string;
  author: {
    nickname: string;
    character: string;
  };
  content: string;
  timestamp: string;
  isAdmin?: boolean;
}

export interface Report {
  id: string;
  author: {
    nickname: string;
    character: string;
    equippedItems?: string[];
  };
  title: string;
  content: string;
  image?: string;
  location: string;
  likes: number;
  commentCount: number;
  comments?: Comment[];
  timestamp: string;
  position?: { x: number; y: number };
  status: ReportStatus;
}

interface ReportCardProps {
  report: Report;
  compact?: boolean;
  onCommentClick?: () => void;
  isLiked?: boolean;
  isBookmarked?: boolean;
  onToggleLike?: (reportId: string) => void;
  onToggleBookmark?: (reportId: string) => void;
}

const statusConfig = {
  inconvenient: { label: '불편해요', color: 'bg-red-100 text-red-700 border-red-200' },
  received: { label: '문제 접수', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  in_progress: { label: '해결 중', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  resolved: { label: '해결 완료', color: 'bg-green-100 text-green-700 border-green-200' },
};

export function ReportCard({ 
  report, 
  compact = false, 
  onCommentClick,
  isLiked = false,
  isBookmarked = false,
  onToggleLike,
  onToggleBookmark
}: ReportCardProps) {
  const handleLike = () => {
    if (onToggleLike) {
      onToggleLike(report.id);
    }
  };

  const handleBookmark = () => {
    if (onToggleBookmark) {
      onToggleBookmark(report.id);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center relative overflow-visible">
              <img 
                src={chachaImage} 
                alt="차차" 
                className="w-8 h-8 object-contain"
              />
              {/* 장착된 아이템 표시 */}
              {report.author.equippedItems && report.author.equippedItems.length > 0 && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                  {report.author.equippedItems.map((itemId) => {
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
            <div>
              <p className="font-medium">{report.author.nickname}</p>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <MapPin className="w-3 h-3" />
                <span>{report.location}</span>
              </div>
            </div>
          </div>
          <span className="text-xs text-gray-400">{report.timestamp}</span>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold flex-1">{report.title}</h3>
            <Badge 
              variant="outline" 
              className={statusConfig[report.status].color}
            >
              {statusConfig[report.status].label}
            </Badge>
          </div>
          {!compact && <p className="text-gray-700">{report.content}</p>}
        </div>

        {/* Image */}
        {report.image && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={report.image}
              alt={report.title}
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleLike}
            >
              <Heart
                className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
              />
              <span>{report.likes}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={onCommentClick}
            >
              <MessageCircle className="w-5 h-5" />
              <span>{report.commentCount}</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
          >
            <Bookmark
              className={`w-5 h-5 ${isBookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`}
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}