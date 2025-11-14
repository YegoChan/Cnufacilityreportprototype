import { Coins, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export interface PointTransaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  reason: string;
  timestamp: string;
}

interface PointHistoryProps {
  transactions: PointTransaction[];
  currentPoints: number;
}

export function PointHistory({ transactions, currentPoints }: PointHistoryProps) {
  const totalEarned = transactions
    .filter(t => t.type === 'earn')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalSpent = transactions
    .filter(t => t.type === 'spend')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* 통계 요약 */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-yellow-600" />
            <span className="text-xs text-gray-600">현재 포인트</span>
          </div>
          <p className="text-xl font-bold text-yellow-600">{currentPoints}P</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-600">총 획득</span>
          </div>
          <p className="text-xl font-bold text-green-600">+{totalEarned}P</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span className="text-xs text-gray-600">총 사용</span>
          </div>
          <p className="text-xl font-bold text-red-600">-{totalSpent}P</p>
        </Card>
      </div>

      {/* 거래 내역 */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">거래 내역</h3>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Coins className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>아직 거래 내역이 없습니다</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'earn' 
                      ? 'bg-green-100' 
                      : 'bg-red-100'
                  }`}>
                    {transaction.type === 'earn' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.reason}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{transaction.timestamp}</span>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="outline"
                  className={transaction.type === 'earn' 
                    ? 'text-green-600 border-green-200' 
                    : 'text-red-600 border-red-200'
                  }
                >
                  {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}P
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
