import { useEffect } from 'react';
import { Card } from './ui/card';

interface LocationPickerMapProps {
  selectedPosition: { x: number; y: number } | null;
  onSelectPosition: (position: { x: number; y: number }) => void;
}

export function LocationPickerMap({ selectedPosition, onSelectPosition }: LocationPickerMapProps) {
  useEffect(() => {
    // iframe에서 위치 선택 메시지 받기
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'LOCATION_SELECTED' && event.data.position) {
        console.log('위치 선택됨:', event.data.position);
        onSelectPosition({
          x: event.data.position.x,
          y: event.data.position.y
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSelectPosition]);

  return (
    <Card className="relative overflow-hidden">
      {/* 카카오맵 iframe */}
      <iframe 
        src="https://yegochan.github.io/figma-map-prototype/location-picker.html"
        className="w-full h-[400px] border-0"
        title="충남대학교 위치 선택"
        allow="geolocation; fullscreen"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        referrerPolicy="no-referrer-when-downgrade"
        loading="eager"
        style={{ display: 'block', width: '100%', height: '400px' }}
      />
      
      {selectedPosition && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg z-10">
          <p className="text-sm font-medium text-green-600">
            ✓ 위치가 선택되었습니다
          </p>
        </div>
      )}
    </Card>
  );
}
