
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hospital, getAlertReasons } from "@/data/hospitalData";
import { MapPin, AlertTriangle, Users, Activity } from "lucide-react";

interface HospitalMapViewProps {
  hospitals: Hospital[];
}

const HospitalMapView = ({ hospitals }: HospitalMapViewProps) => {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

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

  // 模擬地圖位置（實際應該使用真實座標）
  const hospitalPositions = hospitals.map((hospital, index) => ({
    ...hospital,
    x: 20 + (index % 4) * 20 + Math.random() * 10,
    y: 20 + Math.floor(index / 4) * 25 + Math.random() * 10,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 地圖區域 */}
      <div className="lg:col-span-2">
        <Card className="h-96">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="text-blue-600" size={20} />
              桃園地區醫院分布圖
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border">
              {hospitalPositions.map((hospital) => (
                <div
                  key={hospital.id}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                    selectedHospital?.id === hospital.id ? 'scale-125 z-10' : 'hover:scale-110'
                  } transition-all duration-200`}
                  style={{ left: `${hospital.x}%`, top: `${hospital.y}%` }}
                  onClick={() => setSelectedHospital(hospital)}
                >
                  <div className={`w-6 h-6 rounded-full ${getStatusColor(hospital.status)} ${
                    hospital.status === 'emergency' ? 'animate-pulse' : ''
                  } shadow-lg flex items-center justify-center`}>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {hospital.name.length > 8 ? hospital.name.substring(0, 8) + '...' : hospital.name}
                  </div>
                </div>
              ))}
            </div>
            
            {/* 圖例 */}
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">緊急 (&gt; 20)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">警示 (15-20)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">正常 (&lt; 15)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 詳情區域 */}
      <div className="lg:col-span-1">
        <Card className="h-96">
          <CardHeader>
            <CardTitle className="text-lg">醫院詳情</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedHospital ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedHospital.name}</h3>
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(selectedHospital.status)} text-white mt-2`}
                  >
                    {getStatusText(selectedHospital.status)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">EDCI 指數</span>
                    <span className={`font-bold text-lg ${
                      selectedHospital.status === 'emergency' ? 'text-red-600' : 
                      selectedHospital.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {selectedHospital.edci.toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-blue-50 p-2 rounded">
                      <div className="font-semibold text-blue-800">{selectedHospital.totalPatients}</div>
                      <div className="text-gray-600">現場病患</div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <div className="font-semibold text-purple-800">{selectedHospital.waitingForAdmission}</div>
                      <div className="text-gray-600">等待住院</div>
                    </div>
                    <div className="bg-red-50 p-2 rounded">
                      <div className="font-semibold text-red-800">{selectedHospital.adjustedPBR.toFixed(1)}</div>
                      <div className="text-gray-600">醫師壓力</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <div className="font-semibold text-green-800">{selectedHospital.NBR.toFixed(1)}</div>
                      <div className="text-gray-600">護理壓力</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                      <AlertTriangle size={14} className="text-orange-500" />
                      主要問題
                    </h4>
                    <div className="space-y-1">
                      {getAlertReasons(selectedHospital).length > 0 ? (
                        getAlertReasons(selectedHospital).map((reason, index) => (
                          <div key={index} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                            {reason}
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          無異常狀況
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-16">
                <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
                <p>點擊地圖上的醫院查看詳情</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HospitalMapView;
