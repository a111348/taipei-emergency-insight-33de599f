
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hospital } from "@/data/hospitalData";
import StatusIndicator from "./StatusIndicator";
import HospitalDetails from "./HospitalDetails";
import { Building2, Activity } from "lucide-react";

interface HospitalCardProps {
  hospital: Hospital;
  index: number;
}

const HospitalCard = ({ hospital, index }: HospitalCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'emergency': return 'bg-red-600';
      case 'warning': return 'bg-amber-500';
      case 'normal': return 'bg-emerald-600';
      default: return 'bg-gray-600';
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

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    const timeout = setTimeout(() => {
      setShowDetails(true);
    }, 300);
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    const timeout = setTimeout(() => {
      setShowDetails(false);
    }, 100);
    setHoverTimeout(timeout);
  };

  return (
    <div
      className="relative"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Card 
        className={`
          relative overflow-hidden transition-all duration-500 hover:scale-102 hover:shadow-2xl cursor-pointer
          border-l-6 ${getStatusColor(hospital.status).replace('bg-', 'border-')}
          animate-in slide-in-from-bottom bg-slate-800/95 backdrop-blur-sm border-slate-600
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardHeader className="pb-3 bg-gradient-to-r from-slate-700 to-slate-600">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="text-slate-200" size={20} />
              <CardTitle className="text-lg font-bold text-white leading-tight">
                {hospital.name}
              </CardTitle>
            </div>
            <StatusIndicator status={hospital.status} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 bg-slate-800">
          {/* EDCI 指數 - 大螢幕優化字體 */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity size={18} className="text-slate-300" />
              <span className="text-base font-semibold text-slate-200">EDCI 指數</span>
            </div>
            <div className={`
              text-4xl font-black tracking-tight
              ${hospital.status === 'emergency' ? 'text-red-400' : 
                hospital.status === 'warning' ? 'text-amber-400' : 'text-emerald-400'}
            `}>
              {hospital.edci.toFixed(2)}
            </div>
          </div>

          {/* 狀態標籤 - 增大字體 */}
          <div className="flex justify-center">
            <Badge 
              variant="secondary" 
              className={`
                ${getStatusColor(hospital.status)} text-white font-bold px-4 py-2 text-sm border-0
                ${hospital.status === 'emergency' ? 'animate-pulse shadow-lg' : 'shadow-md'}
              `}
            >
              {getStatusText(hospital.status)}
            </Badge>
          </div>

          {/* 基本信息 - 對比度優化 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-slate-700 rounded-lg border border-slate-600">
              <div className="font-black text-xl text-white">{hospital.totalPatients}</div>
              <div className="text-slate-300 text-sm font-medium">現場病患</div>
            </div>
            <div className="text-center p-3 bg-slate-700 rounded-lg border border-slate-600">
              <div className="font-black text-xl text-white">{hospital.waitingForAdmission}</div>
              <div className="text-slate-300 text-sm font-medium">等待住院</div>
            </div>
          </div>

          {/* 懸停提示 */}
          {!showDetails && (
            <div className="text-center text-sm text-slate-400 font-medium">
              懸停查看詳細資訊
            </div>
          )}
        </CardContent>

        {/* 狀態指示邊框 */}
        <div className={`
          absolute inset-0 border-3 border-transparent rounded-lg pointer-events-none
          ${hospital.status === 'emergency' ? 'border-red-600 animate-pulse shadow-red-400/50 shadow-lg' : ''}
        `} />
      </Card>

      {/* 詳細信息彈出框 */}
      {showDetails && (
        <div 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <HospitalDetails hospital={hospital} />
        </div>
      )}
    </div>
  );
};

export default HospitalCard;
