
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, UserCheck, Clock, AlertTriangle } from "lucide-react";
import HospitalCard from "@/components/HospitalCard";
import DashboardGaugeView from "@/components/DashboardGaugeView";
import DashboardStyleSelector from "@/components/DashboardStyleSelector";
import { Hospital, getHospitalData } from "@/data/hospitalData";

const Index = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [dashboardStyle, setDashboardStyle] = useState<number>(1);

  useEffect(() => {
    // 模擬即時數據更新
    const updateData = () => {
      setHospitals(getHospitalData());
      setLastUpdated(new Date());
    };

    updateData();
    const interval = setInterval(updateData, 30000); // 每30秒更新一次

    return () => clearInterval(interval);
  }, []);

  const getStatusCount = (status: string) => {
    return hospitals.filter(h => h.status === status).length;
  };

  const getTotalPatients = () => {
    return hospitals.reduce((sum, h) => sum + h.totalPatients, 0);
  };

  const renderDashboard = () => {
    switch (dashboardStyle) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hospitals.map((hospital, index) => (
              <HospitalCard 
                key={hospital.id} 
                hospital={hospital} 
                index={index}
              />
            ))}
          </div>
        );
      case 4:
        return <DashboardGaugeView hospitals={hospitals} />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hospitals.map((hospital, index) => (
              <HospitalCard 
                key={hospital.id} 
                hospital={hospital} 
                index={index}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Activity className="text-cyan-400" size={40} />
            醫院急診狀態監控儀表板
          </h1>
          <p className="text-slate-300 text-lg">即時監控桃園地區11家醫院急診壅塞指數 (EDCI)</p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-400">
            <Clock size={16} />
            最後更新: {lastUpdated.toLocaleString('zh-TW')}
          </div>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-red-600 to-red-700 text-white border-red-500/30 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle size={16} />
                緊急狀態
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{getStatusCount('emergency')}</div>
              <p className="text-red-200 text-xs">家醫院 (EDCI &gt; 20)</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-600 to-amber-700 text-white border-amber-500/30 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle size={16} />
                警示狀態
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{getStatusCount('warning')}</div>
              <p className="text-amber-200 text-xs">家醫院 (EDCI 15-20)</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-emerald-500/30 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <UserCheck size={16} />
                正常狀態
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{getStatusCount('normal')}</div>
              <p className="text-emerald-200 text-xs">家醫院 (EDCI &lt; 15)</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white border-cyan-500/30 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users size={16} />
                總病患數
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{getTotalPatients()}</div>
              <p className="text-cyan-200 text-xs">位病患</p>
            </CardContent>
          </Card>
        </div>

        {/* 儀表板樣式選擇器 */}
        <DashboardStyleSelector 
          currentStyle={dashboardStyle}
          onStyleChange={setDashboardStyle}
        />

        {/* 狀態說明 */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
            <span className="text-sm text-slate-300">緊急 (EDCI &gt; 20)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded-full shadow-lg"></div>
            <span className="text-sm text-slate-300">警示 (EDCI 15-20)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-lg"></div>
            <span className="text-sm text-slate-300">正常 (EDCI &lt; 15)</span>
          </div>
        </div>

        {/* 動態儀表板內容 */}
        {renderDashboard()}

        <div className="text-center mt-12 text-slate-400 text-sm">
          <p>系統每30秒自動更新數據 | 急診壅塞指數 (EDCI) 新標準監控</p>
          <p className="mt-1">數據包含：醫師壓力比 (PBR)、護理壓力比 (NBR)、等待住院數等關鍵指標</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
