
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'emergency': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'normal': return 'bg-green-500';
      default: return 'bg-gray-500';
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
    <div
      className="relative"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Card 
        className={`
          relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer
          border-l-4 ${getStatusColor(hospital.status).replace('bg-', 'border-')}
          animate-in slide-in-from-bottom
        `}
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="text-blue-600" size={20} />
              <CardTitle className="text-lg font-semibold text-gray-800 leading-tight">
                {hospital.name}
              </CardTitle>
            </div>
            <StatusIndicator status={hospital.status} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* EDCI 指數 */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-600">EDCI 指數</span>
            </div>
            <div className={`
              text-3xl font-bold
              ${hospital.status === 'emergency' ? 'text-red-600' : 
                hospital.status === 'warning' ? 'text-yellow-600' : 'text-green-600'}
            `}>
              {hospital.edci}
            </div>
          </div>

          {/* 狀態標籤 */}
          <div className="flex justify-center">
            <Badge 
              variant="secondary" 
              className={`
                ${getStatusColor(hospital.status)} text-white font-medium px-3 py-1
                ${hospital.status === 'emergency' ? 'animate-pulse' : ''}
              `}
            >
              {getStatusText(hospital.status)}
            </Badge>
          </div>

          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-800">{hospital.totalPatients}</div>
              <div className="text-gray-600 text-xs">現場病患</div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded-lg">
              <div className="font-semibold text-purple-800">{hospital.waitingForAdmission}</div>
              <div className="text-gray-600 text-xs">等待住院</div>
            </div>
          </div>

          {/* 懸停提示 */}
          {!showDetails && (
            <div className="text-center text-xs text-gray-400 italic">
              懸停查看詳細資訊
            </div>
          )}
        </CardContent>

        {/* 狀態指示邊框 */}
        <div className={`
          absolute inset-0 border-2 border-transparent rounded-lg pointer-events-none
          ${hospital.status === 'emergency' ? 'border-red-500 animate-pulse' : ''}
        `} />
      </Card>

      {/* 詳細信息彈出框 */}
      {showDetails && (
        <HospitalDetails hospital={hospital} />
      )}
    </div>
  );
};

export default HospitalCard;
