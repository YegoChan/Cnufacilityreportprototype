import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { GraduationCap } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (studentId: string, isAdmin: boolean, department: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId.trim() && password.trim()) {
      // 관리자 계정 확인 (학번이 "admin"으로 시작하면 관리자)
      const isAdmin = studentId.trim().toLowerCase().startsWith('admin');
      // TODO: 나중에 학교 DB에서 학부 정보를 가져올 예정
      const department = '컴퓨터융합학부';
      onLogin(studentId.trim(), isAdmin, department);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* 모바일 앱 컨테이너 - 고정 너비 */}
      <div className="w-full max-w-md min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 shadow-2xl flex items-center justify-center p-4">
        <Card className="w-full p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">충남대학교</h1>
          <h2 className="text-lg text-gray-600">시설/불편 제보 시스템</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="studentId">학번</Label>
            <Input
              id="studentId"
              type="text"
              placeholder="학번을 입력하세요"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            로그인
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 hover:underline"
            onClick={() => alert('ID 찾기 기능은 준비 중입니다.')}
          >
            ID 찾기
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 hover:underline"
            onClick={() => alert('PW 찾기 기능은 준비 중입니다.')}
          >
            PW 찾기
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>충남대학교 구성원만 이용 가능합니다</p>
        </div>
      </Card>
      </div>
    </div>
  );
}