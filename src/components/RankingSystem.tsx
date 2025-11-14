import { Trophy, Medal, Crown, TrendingUp, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export interface RankingUser {
  id: string;
  nickname: string;
  title: string;
  points: number;
  reportsCount: number;
  commentsCount: number;
  likesReceived: number;
}

interface RankingSystemProps {
  users: RankingUser[];
  currentUserId: string;
}

export function RankingSystem({ users, currentUserId }: RankingSystemProps) {
  // 포인트순 정렬
  const sortedByPoints = [...users].sort((a, b) => b.points - a.points);
  
  // 제보수순 정렬
  const sortedByReports = [...users].sort((a, b) => b.reportsCount - a.reportsCount);
  
  // 공감수순 정렬
  const sortedByLikes = [...users].sort((a, b) => b.likesReceived - a.likesReceived);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-gray-500">{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 2:
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 3:
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const renderRankingList = (sortedUsers: RankingUser[], scoreKey: keyof RankingUser, scoreLabel: string) => (
    <div className="space-y-2">
      {sortedUsers.map((user, index) => {
        const rank = index + 1;
        const isCurrentUser = user.id === currentUserId;
        const score = user[scoreKey];
        
        return (
          <Card 
            key={user.id}
            className={`p-3 transition-all ${
              isCurrentUser 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* 순위 */}
              <div className="flex-shrink-0 w-8 flex items-center justify-center">
                {getRankIcon(rank)}
              </div>

              {/* 사용자 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">
                    {user.nickname}
                    {isCurrentUser && (
                      <span className="ml-1 text-xs text-blue-600">(나)</span>
                    )}
                  </p>
                  {user.title !== 'none' && (
                    <Badge variant="outline" className="text-xs py-0 px-1.5">
                      {user.title}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                  <span>제보 {user.reportsCount}</span>
                  <span>•</span>
                  <span>댓글 {user.commentsCount}</span>
                  <span>•</span>
                  <span>공감 {user.likesReceived}</span>
                </div>
              </div>

              {/* 점수 */}
              <div className="flex-shrink-0">
                <Badge className={`${getRankBadgeColor(rank)} text-xs`}>
                  {typeof score === 'number' ? score : 0}{scoreLabel}
                </Badge>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-600" />
        <div>
          <h2 className="font-bold">명예의 전당</h2>
          <p className="text-xs text-gray-600">캠퍼스를 빛낸 학생들</p>
        </div>
      </div>

      {/* 기간 선택 */}
      <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 p-2 rounded-lg">
        <Calendar className="w-3.5 h-3.5" />
        <span>2025년 11월 1주차 (11/5 기준)</span>
      </div>

      {/* 탭 */}
      <Tabs defaultValue="points" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="points" className="text-sm">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            포인트
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-sm">
            <Trophy className="w-3.5 h-3.5 mr-1" />
            제보왕
          </TabsTrigger>
          <TabsTrigger value="likes" className="text-sm">
            <Medal className="w-3.5 h-3.5 mr-1" />
            인기왕
          </TabsTrigger>
        </TabsList>

        <TabsContent value="points" className="mt-3">
          {renderRankingList(sortedByPoints, 'points', 'P')}
        </TabsContent>

        <TabsContent value="reports" className="mt-3">
          {renderRankingList(sortedByReports, 'reportsCount', '개')}
        </TabsContent>

        <TabsContent value="likes" className="mt-3">
          {renderRankingList(sortedByLikes, 'likesReceived', '개')}
        </TabsContent>
      </Tabs>
    </div>
  );
}
