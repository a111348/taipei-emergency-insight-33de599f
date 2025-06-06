
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
      color: 'bg-slate-600'
    },
    {
      id: 2,
      name: '時間軸監控',
      description: '時序排列顯示，突出時間變化趨勢',
      preview: '📈',
      color: 'bg-indigo-600'
    },
    {
      id: 3,
      name: '雷達全景',
      description: '環形雷達布局，360度狀態監控',
      preview: '🎯',
      color: 'bg-cyan-600'
    },
    {
      id: 4,
      name: '指標儀表',
      description: '儀表盤風格，突出關鍵指標',
      preview: '📊',
      color: 'bg-orange-600'
    },
    {
      id: 5,
      name: '戰術表格',
      description: '軍事風格表格，高密度數據展示',
      preview: '⚡',
      color: 'bg-emerald-700'
    },
    {
      id: 6,
      name: '流程看板',
      description: 'Kanban風格，按狀態分組展示',
      preview: '📋',
      color: 'bg-purple-600'
    },
    {
      id: 7,
      name: '熱力地圖',
      description: '基於風險等級的熱力圖顯示',
      preview: '🔥',
      color: 'bg-red-600'
    }
  ];

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">選擇儀表板樣式</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {styles.map((style) => (
          <Card 
            key={style.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              currentStyle === style.id ? 'ring-4 ring-blue-500 shadow-2xl bg-blue-50' : 'hover:shadow-xl bg-white'
            }`}
            onClick={() => onStyleChange(style.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-full ${style.color} flex items-center justify-center text-white text-lg font-bold shadow-lg`}>
                  {style.preview}
                </div>
                {currentStyle === style.id && (
                  <Badge variant="secondary" className="bg-blue-600 text-white font-bold">選中</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="font-bold text-sm mb-2 text-slate-800">{style.name}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{style.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardStyleSelector;
