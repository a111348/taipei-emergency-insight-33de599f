
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hospital, getAlertReasons } from "@/data/hospitalData";
import { Activity, AlertTriangle, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

interface DashboardGaugeViewProps {
  hospitals: Hospital[];
}

const DashboardGaugeView = ({ hospitals }: DashboardGaugeViewProps) => {
  const [hoveredHospital, setHoveredHospital] = useState<string | null>(null);
  const [lockedHospital, setLockedHospital] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'emergency': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'normal': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getGaugeColor = (value: number, thresholds: { warning: number; emergency: number }) => {
    if (value >= thresholds.emergency) return 'stroke-red-400';
    if (value >= thresholds.warning) return 'stroke-yellow-400';
    return 'stroke-green-400';
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
            className="text-slate-600"
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
          <div className="text-xs text-slate-400">{unit}</div>
        </div>
      </div>
    );
  };

  const HospitalDetailPopover = ({ hospital }: { hospital: Hospital }) => {
    const alertReasons = getAlertReasons(hospital);
    
    return (
      <div className="absolute top-0 left-full ml-4 w-80 z-50 bg-slate-800 border-2 border-slate-600 rounded-lg shadow-2xl p-4 text-white">
        <div className="space-y-3">
          <div className="border-b border-slate-600 pb-2">
            <h3 className="font-bold text-lg text-cyan-400">{hospital.name}</h3>
            <div className="text-sm text-slate-300">詳細醫療資訊</div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-700 p-2 rounded">
              <div className="text-slate-300">EDCI 指數</div>
              <div className={`font-bold text-lg ${getStatusColor(hospital.status)}`}>
                {hospital.edci.toFixed(2)}
              </div>
            </div>
            <div className="bg-slate-700 p-2 rounded">
              <div className="text-slate-300">現場病患</div>
              <div className="font-bold text-lg text-blue-400">{hospital.totalPatients}</div>
            </div>
            <div className="bg-slate-700 p-2 rounded">
              <div className="text-slate-300">等待住院</div>
              <div className="font-bold text-lg text-purple-400">{hospital.waitingForAdmission}</div>
            </div>
            <div className="bg-slate-700 p-2 rounded">
              <div className="text-slate-300">&gt;24小時</div>
              <div className="font-bold text-lg text-orange-400">{hospital.over24Hours}</div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1 text-xs">
            <div className="text-center bg-red-900 p-1 rounded">
              <div className="text-red-300">L1</div>
              <div className="text-white font-bold">{hospital.triageL1}</div>
            </div>
            <div className="text-center bg-orange-900 p-1 rounded">
              <div className="text-orange-300">L2</div>
              <div className="text-white font-bold">{hospital.triageL2}</div>
            </div>
            <div className="text-center bg-yellow-900 p-1 rounded">
              <div className="text-yellow-300">L3</div>
              <div className="text-white font-bold">{hospital.triageL3}</div>
            </div>
            <div className="text-center bg-green-900 p-1 rounded">
              <div className="text-green-300">L4</div>
              <div className="text-white font-bold">{hospital.triageL4}</div>
            </div>
            <div className="text-center bg-blue-900 p-1 rounded">
              <div className="text-blue-300">L5</div>
              <div className="text-white font-bold">{hospital.triageL5}</div>
            </div>
          </div>

          {alertReasons.length > 0 && (
            <div className="bg-red-900/50 border border-red-600 rounded p-2">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={14} className="text-red-400" />
                <span className="text-sm font-medium text-red-300">主要問題</span>
              </div>
              <div className="space-y-1">
                {alertReasons.slice(0, 3).map((reason, index) => (
                  <div key={index} className="text-xs text-red-200">• {reason}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hospitals.map((hospital) => {
        const alertReasons = getAlertReasons(hospital);
        const shouldShowPopover = (lockedHospital === hospital.id) || 
                                 (lockedHospital === null && hoveredHospital === hospital.id);
        
        return (
          <div key={hospital.id} className="relative">
            <Card 
              className={`relative overflow-hidden bg-slate-800 border-slate-600 text-white transition-all duration-300 hover:scale-105 cursor-pointer ${
                lockedHospital === hospital.id ? 'ring-2 ring-cyan-400' : ''
              }`}
              onMouseEnter={() => {
                if (lockedHospital === null) {
                  setHoveredHospital(hospital.id);
                }
              }}
              onMouseLeave={() => {
                if (lockedHospital === null) {
                  setHoveredHospital(null);
                }
              }}
              onClick={() => {
                if (lockedHospital === hospital.id) {
                  setLockedHospital(null);
                } else {
                  setLockedHospital(hospital.id);
                  setHoveredHospital(null);
                }
              }}
            >
              <CardHeader className="pb-3 bg-slate-700">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-white">{hospital.name}</CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      hospital.status === 'emergency' ? 'bg-red-500' : 
                      hospital.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                    } text-white border-0`}
                  >
                    {hospital.status === 'emergency' ? '緊急' : 
                     hospital.status === 'warning' ? '警示' : '正常'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 bg-slate-800">
                {/* EDCI 主要指標 */}
                <div className="text-center border-b border-slate-600 pb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Activity size={20} className="text-cyan-400" />
                    <span className="font-medium text-slate-200">EDCI 指數</span>
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
                    <div className="text-xs text-slate-400 mt-1">醫師壓力比</div>
                  </div>

                  <div className="text-center">
                    <GaugeChart
                      value={hospital.NBR}
                      max={80}
                      label="護理壓力"
                      unit="NBR"
                      thresholds={{ warning: 30, emergency: 40 }}
                    />
                    <div className="text-xs text-slate-400 mt-1">護理壓力比</div>
                  </div>
                </div>

                {/* 基本統計 */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-slate-700 rounded border border-slate-600">
                    <div className="font-semibold text-blue-400">{hospital.totalPatients}</div>
                    <div className="text-slate-400 text-xs">現場病患</div>
                  </div>
                  <div className="text-center p-2 bg-slate-700 rounded border border-slate-600">
                    <div className="font-semibold text-purple-400">{hospital.waitingForAdmission}</div>
                    <div className="text-slate-400 text-xs">等待住院</div>
                  </div>
                  <div className="text-center p-2 bg-slate-700 rounded border border-slate-600">
                    <div className="font-semibold text-orange-400">{hospital.over24Hours}</div>
                    <div className="text-slate-400 text-xs">&gt;24小時</div>
                  </div>
                </div>

                {/* 問題警示 */}
                {alertReasons.length > 0 && (
                  <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={16} className="text-red-400" />
                      <span className="text-sm font-medium text-red-300">主要問題</span>
                    </div>
                    <div className="space-y-1">
                      {alertReasons.slice(0, 2).map((reason, index) => (
                        <div key={index} className="text-xs text-red-200">
                          • {reason}
                        </div>
                      ))}
                      {alertReasons.length > 2 && (
                        <div className="text-xs text-red-300">
                          還有 {alertReasons.length - 2} 個問題...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 點擊提示 */}
                <div className="text-center text-xs text-slate-500">
                  {lockedHospital === hospital.id ? '點擊關閉詳細資訊' : '點擊鎖定詳細資訊'}
                </div>
              </CardContent>

              {/* 狀態邊框 */}
              <div className={`absolute inset-0 border-2 border-transparent rounded-lg pointer-events-none ${
                hospital.status === 'emergency' ? 'border-red-500/50 animate-pulse' : ''
              }`} />
            </Card>

            {/* 詳細信息彈出框 */}
            {shouldShowPopover && (
              <HospitalDetailPopover hospital={hospital} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardGaugeView;
