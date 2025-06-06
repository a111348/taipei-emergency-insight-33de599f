
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
      color: 'bg-gradient-to-br from-slate-600 to-slate-700'
    },
    {
      id: 4,
      name: '指標儀表',
      description: '儀表盤風格，突出關鍵指標',
      preview: '📊',
      color: 'bg-gradient-to-br from-blue-600 to-blue-700'
    }
  ];

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">選擇儀表板樣式</h3>
      <div className="flex justify-center gap-8">
        {styles.map((style) => (
          <Card 
            key={style.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 w-64 ${
              currentStyle === style.id 
                ? 'ring-4 ring-cyan-400 shadow-2xl bg-slate-700 border-cyan-400' 
                : 'hover:shadow-xl bg-slate-800 border-slate-600 hover:border-slate-500'
            }`}
            onClick={() => onStyleChange(style.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-full ${style.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                  {style.preview}
                </div>
                {currentStyle === style.id && (
                  <Badge variant="secondary" className="bg-cyan-600 text-white font-bold">選中</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="font-bold text-lg mb-2 text-white">{style.name}</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{style.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardStyleSelector;
