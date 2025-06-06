
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hospital, getAlertReasons } from "@/data/hospitalData";
import { Target, Radar, AlertTriangle, Activity } from "lucide-react";

interface RadarPanoramaViewProps {
  hospitals: Hospital[];
}

const RadarPanoramaView = ({ hospitals }: RadarPanoramaViewProps) => {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'emergency': return 'bg-red-600';
      case 'warning': return 'bg-amber-500';
      case 'normal': return 'bg-emerald-600';
      default: return 'bg-slate-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'emergency': return '緊急';
      case 'warning': return '警示';
      case 'normal': return '正常';
      default: return '未知';
    }
  };

  // 計算醫院在圓形布局中的位置
  const getHospitalPosition = (index: number, total: number) => {
    const angle = (index * 360) / total;
    const radius = 35; // 35% 的半徑
    const x = 50 + radius * Math.cos((angle - 90) * Math.PI / 180);
    const y = 50 + radius * Math.sin((angle - 90) * Math.PI / 180);
    return { x: `${x}%`, y: `${y}%` };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 雷達圓形視圖 */}
      <div className="lg:col-span-2">
        <Card className="h-[600px] bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Radar className="text-green-400 animate-spin" size={28} />
              360° 雷達監控
            </CardTitle>
          </CardHeader>
          <CardContent className="relative h-full">
            {/* 雷達圓環 */}
            <div className="absolute inset-8">
              <div className="relative w-full h-full">
                {/* 雷達圓環背景 */}
                {[1, 2, 3].map((ring) => (
                  <div
                    key={ring}
                    className="absolute inset-0 border-2 border-green-400/30 rounded-full"
                    style={{ 
                      transform: `scale(${ring * 0.33})`,
                      top: '50%',
                      left: '50%',
                      translateX: '-50%',
                      translateY: '-50%'
                    }}
                  />
                ))}
                
                {/* 十字線 */}
                <div className="absolute top-1/2 left-0 right-0 border-t border-green-400/30"></div>
                <div className="absolute left-1/2 top-0 bottom-0 border-l border-green-400/30"></div>
                
                {/* 醫院點位 */}
                {hospitals.map((hospital, index) => {
                  const position = getHospitalPosition(index, hospitals.length);
                  return (
                    <div
                      key={hospital.id}
                      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                      style={{ left: position.x, top: position.y }}
                      onClick={() => setSelectedHospital(hospital)}
                    >
                      {/* 醫院指示點 */}
                      <div className={`
                        w-6 h-6 rounded-full border-4 border-white shadow-lg transition-all duration-300
                        ${getStatusColor(hospital.status)}
                        ${hospital.status === 'emergency' ? 'animate-pulse' : ''}
                        ${selectedHospital?.id === hospital.id ? 'scale-150' : 'group-hover:scale-125'}
                      `}>
                      </div>
                      
                      {/* 醫院名稱標籤 */}
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {hospital.name}
                      </div>
                      
                      {/* EDCI 數值 */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white bg-black/50 px-1 rounded">
                        {hospital.edci.toFixed(0)}
                      </div>
                    </div>
                  );
                })}
                
                {/* 中心目標 */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Target className="text-green-400 animate-pulse" size={32} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 詳情面板 */}
      <div className="lg:col-span-1">
        <Card className="h-[600px] overflow-y-auto">
          <CardHeader>
            <CardTitle className="text-xl">雷達詳情</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedHospital ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{selectedHospital.name}</h3>
                  <Badge 
                    className={`${getStatusColor(selectedHospital.status)} text-white font-bold mt-2`}
                  >
                    {getStatusText(selectedHospital.status)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-slate-600 mb-1">EDCI 指數</div>
                      <div className={`text-3xl font-black ${
                        selectedHospital.status === 'emergency' ? 'text-red-600' : 
                        selectedHospital.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {selectedHospital.edci.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-100 p-3 rounded-lg text-center">
                      <div className="font-black text-lg text-slate-800">{selectedHospital.totalPatients}</div>
                      <div className="text-sm text-slate-600">現場病患</div>
                    </div>
                    <div className="bg-slate-100 p-3 rounded-lg text-center">
                      <div className="font-black text-lg text-slate-800">{selectedHospital.waitingForAdmission}</div>
                      <div className="text-sm text-slate-600">等待住院</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                      <AlertTriangle size={14} className="text-orange-500" />
                      系統警示
                    </h4>
                    <div className="space-y-2">
                      {getAlertReasons(selectedHospital).length > 0 ? (
                        getAlertReasons(selectedHospital).map((reason, index) => (
                          <div key={index} className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded border border-red-200">
                            {reason}
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded border border-emerald-200">
                          系統運行正常
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 mt-16">
                <Target size={48} className="mx-auto mb-4 text-slate-300" />
                <p>點擊雷達上的醫院查看詳情</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RadarPanoramaView;
