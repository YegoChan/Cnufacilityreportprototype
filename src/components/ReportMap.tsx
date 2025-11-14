import { MapPin } from 'lucide-react';
import { Card } from './ui/card';

interface ReportMapProps {
  reports?: any[];
  onPinClick?: (report: any) => void;
}

export function ReportMap({ reports, onPinClick }: ReportMapProps) {
  return (
    <div className="space-y-4">
      {/* 지도 */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
          <p className="text-sm font-medium mb-2">공감수 범위</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500 fill-red-500" />
              <span>높음 (50+)</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>중간 (20-49)</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>낮음 (0-19)</span>
            </div>
          </div>
        </div>

        {/* 외부 지도 Iframe */}
        <iframe 
          src="https://yegochan.github.io/figma-map-prototype/"
          className="w-full h-[500px] border-0"
          title="충남대학교 캠퍼스 지도"
          allow="geolocation; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          referrerPolicy="no-referrer-when-downgrade"
          loading="eager"
          style={{ display: 'block', width: '100%', height: '500px' }}
        />
      </Card>
    </div>
  );
}
