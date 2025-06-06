
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, UserCheck, Clock, AlertTriangle } from "lucide-react";
import HospitalCard from "@/components/HospitalCard";
import { Hospital, getHospitalData } from "@/data/hospitalData";

const Index = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

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

  const getAverageEDCI = () => {
    if (hospitals.length === 0) return 0;
    const total = hospitals.reduce((sum, h) => sum + h.edci, 0);
    return Math.round(total / hospitals.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Activity className="text-blue-600" size={40} />
            醫院急診狀態監控儀表板
          </h1>
          <p className="text-gray-600 text-lg">即時監控桃園地區11家醫院急診壅塞指數</p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
            <Clock size={16} />
            最後更新: {lastUpdated.toLocaleString('zh-TW')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle size={16} />
                緊急狀態
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getStatusCount('emergency')}</div>
              <p className="text-red-100 text-xs">家醫院</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle size={16} />
                警示狀態
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getStatusCount('warning')}</div>
              <p className="text-yellow-100 text-xs">家醫院</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <UserCheck size={16} />
                正常狀態
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getStatusCount('normal')}</div>
              <p className="text-green-100 text-xs">家醫院</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users size={16} />
                總病患數
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalPatients()}</div>
              <p className="text-blue-100 text-xs">位病患</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">緊急 (EDCI ≥ 85)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">警示 (EDCI 65-84)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">正常 (EDCI < 65)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hospitals.map((hospital, index) => (
            <HospitalCard 
              key={hospital.id} 
              hospital={hospital} 
              index={index}
            />
          ))}
        </div>

        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>系統每30秒自動更新數據 | 急診壅塞指數 (EDCI) 即時監控</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
