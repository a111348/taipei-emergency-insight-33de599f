
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hospital, getAlertReasons } from "@/data/hospitalData";
import { Clock, TrendingUp, AlertTriangle, Activity } from "lucide-react";

interface TimelineMonitorViewProps {
  hospitals: Hospital[];
}

const TimelineMonitorView = ({ hospitals }: TimelineMonitorViewProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  
  const sortedHospitals = [...hospitals].sort((a, b) => b.edci - a.edci);

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

  return (
    <div className="space-y-6">
      {/* 時間軸控制 */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Clock className="text-blue-400" size={28} />
            時間軸監控面板
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {['current', '1h', '6h', '24h'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  selectedPeriod === period 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {period === 'current' ? '即時' : period === '1h' ? '1小時' : period === '6h' ? '6小時' : '24小時'}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 時間軸醫院列表 */}
      <div className="space-y-4">
        {sortedHospitals.map((hospital, index) => (
          <Card key={hospital.id} className="overflow-hidden bg-white border-l-6 border-slate-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {/* 醫院基本信息 */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-slate-700 mb-1">
                      #{index + 1}
                    </div>
                    <div className="text-sm text-slate-500">排序</div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{hospital.name}</h3>
                    <div className="flex items-center gap-4">
                      <Badge 
                        className={`${getStatusColor(hospital.status)} text-white font-bold px-3 py-1`}
                      >
                        {getStatusText(hospital.status)}
                      </Badge>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Activity size={16} />
                        <span className="font-medium">EDCI: {hospital.edci.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 趨勢指標 */}
                <div className="flex items-center gap-8">
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <div className="font-black text-lg text-slate-800">{hospital.totalPatients}</div>
                      <div className="text-sm text-slate-600">病患數</div>
                    </div>
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <div className="font-black text-lg text-slate-800">{hospital.waitingForAdmission}</div>
                      <div className="text-sm text-slate-600">等候</div>
                    </div>
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <div className="font-black text-lg text-slate-800">{hospital.adjustedPBR.toFixed(0)}</div>
                      <div className="text-sm text-slate-600">壓力比</div>
                    </div>
                  </div>

                  {/* 趨勢箭頭 */}
                  <div className="flex items-center">
                    <TrendingUp 
                      size={32} 
                      className={`${
                        hospital.status === 'emergency' ? 'text-red-600' :
                        hospital.status === 'warning' ? 'text-amber-500' : 'text-emerald-600'
                      }`} 
                    />
                  </div>
                </div>
              </div>

              {/* 警示信息 */}
              {getAlertReasons(hospital).length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-red-600" />
                    <span className="font-bold text-red-800">異常警示</span>
                  </div>
                  <div className="text-sm text-red-700">
                    {getAlertReasons(hospital).join(' • ')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TimelineMonitorView;
