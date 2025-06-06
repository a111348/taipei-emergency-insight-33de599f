
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardStyleSelectorProps {
  onStyleChange: (style: number) => void;
  currentStyle: number;
}

const DashboardStyleSelector = ({ onStyleChange, currentStyle }: DashboardStyleSelectorProps) => {
  const styles = [
    {
      id: 1,
      name: '經典網格',
      description: '傳統卡片網格布局，信息清晰分層',
      preview: '🔲',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: '緊湊列表',
      description: '高密度信息展示，適合大屏監控',
      preview: '📋',
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: '戰情地圖',
      description: '視覺化地圖布局，直觀展示狀態',
      preview: '🗺️',
      color: 'bg-purple-500'
    },
    {
      id: 4,
      name: '指標儀表',
      description: '儀表盤風格，突出關鍵指標',
      preview: '📊',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">選擇儀表板樣式</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {styles.map((style) => (
          <Card 
            key={style.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
              currentStyle === style.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
            }`}
            onClick={() => onStyleChange(style.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-full ${style.color} flex items-center justify-center text-white text-sm`}>
                  {style.preview}
                </div>
                {currentStyle === style.id && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">選中</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold text-sm mb-1">{style.name}</h4>
              <p className="text-xs text-gray-600">{style.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardStyleSelector;
