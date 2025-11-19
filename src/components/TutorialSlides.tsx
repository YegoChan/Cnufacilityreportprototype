import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, X, Pencil, Heart, MessageCircle, TrendingUp, ShoppingBag, Award } from 'lucide-react';

interface TutorialSlidesProps {
  onComplete: () => void;
}

export function TutorialSlides({ onComplete }: TutorialSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: '환영합니다! 👋',
      description: '충남대학교 시설/불편 제보 앱에\n오신 것을 환영합니다!',
      content: (
        <div className="flex flex-col items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
            <img 
              src="/chacha.png" 
              alt="차차" 
              className="w-28 h-28 object-contain"
            />
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg">캠퍼스의 불편함을</p>
            <p className="text-lg">함께 개선해나가요!</p>
          </div>
        </div>
      )
    },
    {
      title: '제보 작성하기 ✍️',
      description: '불편한 시설을 발견하셨나요?',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Pencil className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">플로팅 버튼 클릭</p>
                <p className="text-sm text-gray-600">화면 우측 하단의 파란 버튼</p>
              </div>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 space-y-2">
              <p className="text-sm">• 사진과 함께 상세히 작성</p>
              <p className="text-sm">• 정확한 위치 선택</p>
              <p className="text-sm">• 제보 시 <span className="font-semibold text-blue-600">10포인트</span> 획득!</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '소통하기 💬',
      description: '다른 학생들과 함께 공감하세요',
      content: (
        <div className="space-y-4">
          <div className="bg-pink-50 rounded-xl p-4 flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-500" />
            <div>
              <p className="font-semibold">공감 버튼</p>
              <p className="text-sm text-gray-600">같은 불편함을 느끼셨다면 공감!</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-blue-500" />
            <div>
              <p className="font-semibold">댓글 작성</p>
              <p className="text-sm text-gray-600">의견을 나누고 <span className="font-semibold text-blue-600">5포인트</span> 획득</p>
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <div>
              <p className="font-semibold">지금 뜨는 불편함</p>
              <p className="text-sm text-gray-600">공감 많은 제보는 메인에 노출</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '포인트 & 업적 🏆',
      description: '활동하며 보상을 받아보세요',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4">
            <p className="font-semibold mb-3">포인트 획득 방법</p>
            <div className="space-y-2 text-sm">
              <p>✍️ 제보 작성: <span className="font-bold text-blue-600">10P</span></p>
              <p>💬 댓글 작성: <span className="font-bold text-blue-600">5P</span></p>
              <p>🏆 업적 달성: <span className="font-bold text-blue-600">추가 포인트!</span></p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-purple-600" />
              <p className="font-semibold">업적 & 칭호 시스템</p>
            </div>
            <p className="text-sm text-gray-600">
              다양한 업적을 달성하고 특별한 칭호를 획득하세요!
            </p>
          </div>
        </div>
      )
    },
    {
      title: '상점 & 꾸미기 🎨',
      description: '차차를 내 스타일로 꾸며보세요',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-6 flex flex-col items-center">
            <div className="relative mb-4 w-24 h-24 flex items-center justify-center">
              <img 
                src="/chacha.png" 
                alt="차차" 
                className="w-20 h-20 object-contain"
              />
              <img 
                src="/straw-hat-layer.png" 
                alt="밀짚모자" 
                className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-20 object-contain"
              />
            </div>
            <div className="flex gap-2 mb-2">
              {['/straw-hat.png', '/party-hat.png', '/mask.png', '/bow.png'].map((item, idx) => (
                <div key={idx} className="w-10 h-10 bg-white rounded-lg p-1">
                  <img src={item} alt="" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-blue-500" />
            <div>
              <p className="font-semibold">포인트로 아이템 구매</p>
              <p className="text-sm text-gray-600">모자, 안경, 액세서리 등 다양한 아이템!</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '준비 완료! 🚀',
      description: '이제 시작해볼까요?',
      content: (
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center relative">
              <img 
                src="/chacha.png" 
                alt="차차" 
                className="w-28 h-28 object-contain"
              />
              <img 
                src="/straw-hat-layer.png" 
                alt="밀짚모자" 
                className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-28 object-contain"
              />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">모든 준비가 끝났습니다!</p>
              <p className="text-gray-600">
                캠퍼스를 더 나은 곳으로<br />
                함께 만들어가요 💪
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 text-center space-y-2">
            <p className="font-semibold">💡 Tip</p>
            <p className="text-sm">
              우측 하단 파란 버튼을 눌러<br />
              첫 제보를 작성해보세요!
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 relative">
          <button
            onClick={onComplete}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="건너뛰기"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold mb-1">{slides[currentSlide].title}</h2>
          <p className="text-sm text-blue-100 whitespace-pre-line">
            {slides[currentSlide].description}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px] flex flex-col justify-center">
          {slides[currentSlide].content}
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 pb-4">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-blue-500' 
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="p-6 pt-0 flex justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            이전
          </Button>
          
          {isLastSlide ? (
            <Button
              onClick={onComplete}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              시작하기 🚀
            </Button>
          ) : (
            <Button
              onClick={nextSlide}
              className="flex-1"
            >
              다음
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}