
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hospital, getAlertReasons } from "@/data/hospitalData";
import { Activity, AlertTriangle, TrendingUp, Users } from "lucide-react";

interface DashboardGaugeViewProps {
  hospitals: Hospital[];
}

const DashboardGaugeView = ({ hospitals }: DashboardGaugeViewProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'emergency': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'normal': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getGaugeColor = (value: number, thresholds: { warning: number; emergency: number }) => {
    if (value >= thresholds.emergency) return 'stroke-red-500';
    if (value >= thresholds.warning) return 'stroke-yellow-500';
    return 'stroke-green-500';
  };

  const GaugeChart = ({ value, max, label, unit, thresholds }: {
    value: number;
    max: number;
    label: string;
    unit: string;
    thresholds: { warning: number; emergency: number };
  }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const strokeDasharray = `${percentage * 2.51} 251`;
    
    return (
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className={getGaugeColor(value, thresholds)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-lg font-bold ${getStatusColor(
            value >= thresholds.emergency ? 'emergency' : 
            value >= thresholds.warning ? 'warning' : 'normal'
          )}`}>
            {typeof value === 'number' ? value.toFixed(1) : value}
          </div>
          <div className="text-xs text-gray-500">{unit}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hospitals.map((hospital) => {
        const alertReasons = getAlertReasons(hospital);
        
        return (
          <Card key={hospital.id} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold">{hospital.name}</CardTitle>
                <Badge 
                  variant="secondary" 
                  className={`${
                    hospital.status === 'emergency' ? 'bg-red-500' : 
                    hospital.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                  } text-white`}
                >
                  {hospital.status === 'emergency' ? '緊急' : 
                   hospital.status === 'warning' ? '警示' : '正常'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* EDCI 主要指標 */}
              <div className="text-center border-b pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Activity size={20} className="text-blue-600" />
                  <span className="font-medium">EDCI 指數</span>
                </div>
                <div className={`text-3xl font-bold ${getStatusColor(hospital.status)}`}>
                  {hospital.edci.toFixed(2)}
                </div>
              </div>

              {/* 關鍵指標儀表 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <GaugeChart
                    value={hospital.adjustedPBR}
                    max={150}
                    label="醫師壓力"
                    unit="PBR"
                    thresholds={{ warning: 60, emergency: 80 }}
                  />
                  <div className="text-xs text-gray-600 mt-1">醫師壓力比</div>
                </div>

                <div className="text-center">
                  <GaugeChart
                    value={hospital.NBR}
                    max={80}
                    label="護理壓力"
                    unit="NBR"
                    thresholds={{ warning: 30, emergency: 40 }}
                  />
                  <div className="text-xs text-gray-600 mt-1">護理壓力比</div>
                </div>
              </div>

              {/* 基本統計 */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-semibold text-blue-800">{hospital.totalPatients}</div>
                  <div className="text-gray-600 text-xs">現場病患</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="font-semibold text-purple-800">{hospital.waitingForAdmission}</div>
                  <div className="text-gray-600 text-xs">等待住院</div>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded">
                  <div className="font-semibold text-orange-800">{hospital.over24Hours}</div>
                  <div className="text-gray-600 text-xs">&gt;24小時</div>
                </div>
              </div>

              {/* 問題警示 */}
              {alertReasons.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-red-500" />
                    <span className="text-sm font-medium text-red-700">主要問題</span>
                  </div>
                  <div className="space-y-1">
                    {alertReasons.slice(0, 2).map((reason, index) => (
                      <div key={index} className="text-xs text-red-600">
                        • {reason}
                      </div>
                    ))}
                    {alertReasons.length > 2 && (
                      <div className="text-xs text-red-500">
                        還有 {alertReasons.length - 2} 個問題...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>

            {/* 狀態邊框 */}
            <div className={`absolute inset-0 border-2 border-transparent rounded-lg pointer-events-none ${
              hospital.status === 'emergency' ? 'border-red-500 animate-pulse' : ''
            }`} />
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardGaugeView;
