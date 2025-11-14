import { Trophy, Check, Lock, Coins } from 'lucide-react';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  requirement: number;
  icon: string;
  category: 'report' | 'social' | 'engagement' | 'special';
  rewardTitle?: string;
}

interface AchievementsTabProps {
  achievements: Achievement[];
  completedAchievements: Set<string>;
  progress: Record<string, number>;
}

const categoryLabels = {
  report: '제보 활동',
  social: '소셜 활동',
  engagement: '참여도',
  special: '특별 업적',
};

const categoryColors = {
  report: 'bg-blue-50 border-blue-200',
  social: 'bg-green-50 border-green-200',
  engagement: 'bg-purple-50 border-purple-200',
  special: 'bg-yellow-50 border-yellow-200',
};

export function AchievementsTab({ achievements, completedAchievements, progress }: AchievementsTabProps) {
  // Safety check
  if (!achievements || !Array.isArray(achievements)) {
    return (
      <div className="text-center py-8 text-gray-500">
        업적 데이터를 불러오는 중...
      </div>
    );
  }

  const groupedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  return (
    <div className="space-y-6 mt-4">
      {/* 안내 메시지 */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-200">
        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          포인트 획득 방법
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold">•</span>
            <span>
              <span className="font-semibold">제보 작성</span> 시 <span className="font-bold text-yellow-600">+10P</span>
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold">•</span>
            <span>
              <span className="font-semibold">댓글 작성</span> 시 <span className="font-bold text-yellow-600">+5P</span>
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold">•</span>
            <span>
              <span className="font-semibold">업적 달성</span> 시 아래의 포인트 획득!
            </span>
          </div>
        </div>
      </div>

      {/* 진행도 요약 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-200">
          <p className="text-sm text-gray-600 mb-1">달성한 업적</p>
          <p className="text-2xl font-bold text-blue-600">
            {completedAchievements.size} / {achievements.length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center border border-green-200">
          <p className="text-sm text-gray-600 mb-1">획득한 포인트</p>
          <p className="text-2xl font-bold text-green-600">
            {achievements
              .filter(a => completedAchievements.has(a.id))
              .reduce((sum, a) => sum + a.points, 0)
              .toLocaleString()}P
          </p>
        </div>
      </div>

      {/* 카테고리별 업적 */}
      {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
        <div key={category} className="space-y-3">
          <h3 className="font-semibold text-sm text-gray-700 px-2 flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            {categoryLabels[category as keyof typeof categoryLabels]}
          </h3>
          <div className="space-y-2">
            {categoryAchievements.map((achievement) => {
              const isCompleted = completedAchievements.has(achievement.id);
              const currentProgress = progress[achievement.id] || 0;
              const progressPercent = Math.min((currentProgress / achievement.requirement) * 100, 100);

              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isCompleted
                      ? 'border-green-300 bg-gradient-to-r from-green-50 to-green-100'
                      : categoryColors[category as keyof typeof categoryColors]
                  } ${isCompleted ? '' : 'opacity-90'}`}
                >
                  <div className="flex items-start gap-3">
                    {/* 아이콘 */}
                    <div
                      className={`text-4xl flex-shrink-0 ${
                        isCompleted ? 'grayscale-0' : 'grayscale opacity-50'
                      }`}
                    >
                      {achievement.icon}
                    </div>

                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            {isCompleted ? (
                              <Badge className="bg-green-500 text-white border-green-600">
                                <Check className="w-3 h-3 mr-1" />
                                완료
                              </Badge>
                            ) : (
                              <Lock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>

                        {/* 포인트 */}
                        <div
                          className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                            isCompleted ? 'bg-green-200' : 'bg-yellow-100'
                          }`}
                        >
                          <Coins className={`w-4 h-4 ${isCompleted ? 'text-green-700' : 'text-yellow-600'}`} />
                          <span
                            className={`font-bold text-sm whitespace-nowrap ${
                              isCompleted ? 'text-green-700' : 'text-yellow-600'
                            }`}
                          >
                            {achievement.points}P
                          </span>
                        </div>
                      </div>

                      {/* 진행도 바 */}
                      {!isCompleted && (
                        <div className="space-y-1">
                          <Progress value={progressPercent} className="h-2" />
                          <p className="text-xs text-gray-500 text-right">
                            {currentProgress} / {achievement.requirement}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
