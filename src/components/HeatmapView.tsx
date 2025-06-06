
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hospital } from "@/data/hospitalData";
import { Flame, Thermometer, BarChart3 } from "lucide-react";

interface HeatmapViewProps {
  hospitals: Hospital[];
}

const HeatmapView = ({ hospitals }: HeatmapViewProps) => {
  const [selectedMetric, setSelectedMetric] = useState<'edci' | 'patients' | 'waiting'>('edci');
  
  const getHeatColor = (value: number, metric: string) => {
    let intensity = 0;
    switch (metric) {
      case 'edci':
        intensity = Math.min(value / 30, 1); // 最大值30
        break;
      case 'patients':
        intensity = Math.min(value / 100, 1); // 最大值100
        break;
      case 'waiting':
        intensity = Math.min(value / 50, 1); // 最大值50
        break;
    }
    
    const red = Math.round(255 * intensity);
    const green = Math.round(255 * (1 - intensity));
    return `rgb(${red}, ${green}, 50)`;
  };

  const getMetricValue = (hospital: Hospital, metric: string) => {
    switch (metric) {
      case 'edci': return hospital.edci;
      case 'patients': return hospital.totalPatients;
      case 'waiting': return hospital.waitingForAdmission;
      default: return 0;
    }
  };

  const getMetricName = (metric: string) => {
    switch (metric) {
      case 'edci': return 'EDCI指數';
      case 'patients': return '病患數量';
      case 'waiting': return '等待人數';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Flame className="animate-pulse" size={28} />
            熱力圖監控面板
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {[
              { key: 'edci', label: 'EDCI指數', icon: <Thermometer size={20} /> },
              { key: 'patients', label: '病患數量', icon: <BarChart3 size={20} /> },
              { key: 'waiting', label: '等待人數', icon: <BarChart3 size={20} /> }
            ].map((metric) => (
              <button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                  selectedMetric === metric.key 
                    ? 'bg-white text-orange-600 shadow-lg' 
                    : 'bg-orange-700 text-white hover:bg-orange-600'
                }`}
              >
                {metric.icon}
                {metric.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 熱力圖網格 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="text-orange-500" size={24} />
            {getMetricName(selectedMetric)} 熱力分布
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {hospitals.map((hospital) => {
              const value = getMetricValue(hospital, selectedMetric);
              const heatColor = getHeatColor(value, selectedMetric);
              
              return (
                <Card 
                  key={hospital.id} 
                  className="transition-all duration-300 hover:scale-105 cursor-pointer border-2"
                  style={{ 
                    backgroundColor: heatColor,
                    borderColor: heatColor
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <h4 className="font-bold text-white text-shadow mb-2 text-sm">
                      {hospital.name}
                    </h4>
                    <div className="bg-black/50 rounded-lg p-3 backdrop-blur-sm">
                      <div className="text-2xl font-black text-white mb-1">
                        {selectedMetric === 'edci' ? value.toFixed(1) : Math.round(value)}
                      </div>
                      <div className="text-xs text-white/80 font-medium">
                        {getMetricName(selectedMetric)}
                      </div>
                    </div>
                    
                    <Badge 
                      className={`mt-2 text-white font-bold ${
                        hospital.status === 'emergency' ? 'bg-red-800' :
                        hospital.status === 'warning' ? 'bg-amber-700' : 'bg-emerald-700'
                      }`}
                    >
                      {hospital.status === 'emergency' ? '緊急' :
                       hospital.status === 'warning' ? '警示' : '正常'}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* 熱力圖圖例 */}
          <div className="mt-6 p-4 bg-slate-100 rounded-lg">
            <h4 className="font-bold text-slate-800 mb-3">熱力圖圖例</h4>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600">低風險</span>
              <div className="flex-1 h-4 rounded-lg bg-gradient-to-r from-green-400 to-red-600"></div>
              <span className="text-sm font-medium text-slate-600">高風險</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeatmapView;
