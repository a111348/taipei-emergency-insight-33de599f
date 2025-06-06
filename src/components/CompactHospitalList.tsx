
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hospital, getAlertReasons } from "@/data/hospitalData";
import { AlertTriangle, Users, Clock } from "lucide-react";

interface CompactHospitalListProps {
  hospitals: Hospital[];
}

const CompactHospitalList = ({ hospitals }: CompactHospitalListProps) => {
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
    <Card className="w-full">
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
              <div className="col-span-3">醫院名稱</div>
              <div className="col-span-1 text-center">EDCI</div>
              <div className="col-span-1 text-center">狀態</div>
              <div className="col-span-1 text-center">病患</div>
              <div className="col-span-2 text-center">醫師壓力</div>
              <div className="col-span-2 text-center">護理壓力</div>
              <div className="col-span-2">主要問題</div>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {hospitals.map((hospital, index) => {
              const alertReasons = getAlertReasons(hospital);
              return (
                <div 
                  key={hospital.id}
                  className={`px-4 py-3 border-b hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <div className="grid grid-cols-12 gap-4 items-center text-sm">
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(hospital.status)} ${
                          hospital.status === 'emergency' ? 'animate-pulse' : ''
                        }`}></div>
                        <span className="font-medium">{hospital.name}</span>
                      </div>
                    </div>
                    
                    <div className="col-span-1 text-center">
                      <span className={`font-bold ${
                        hospital.status === 'emergency' ? 'text-red-600' : 
                        hospital.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {hospital.edci.toFixed(1)}
                      </span>
                    </div>
                    
                    <div className="col-span-1 text-center">
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(hospital.status)} text-white text-xs px-2 py-1`}
                      >
                        {getStatusText(hospital.status)}
                      </Badge>
                    </div>
                    
                    <div className="col-span-1 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users size={14} className="text-blue-600" />
                        <span>{hospital.totalPatients}</span>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-center">
                      <div className={`font-semibold ${hospital.adjustedPBR > 80 ? 'text-red-600' : 'text-gray-700'}`}>
                        {hospital.adjustedPBR.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {hospital.effectiveDoctorFTE} FTE
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-center">
                      <div className={`font-semibold ${hospital.NBR > 40 ? 'text-red-600' : 'text-gray-700'}`}>
                        {hospital.NBR.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {hospital.nurses} 護理師
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      {alertReasons.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <AlertTriangle size={14} className="text-red-500" />
                          <span className="text-xs text-red-600 truncate">
                            {alertReasons[0]}
                            {alertReasons.length > 1 && ` +${alertReasons.length - 1}`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-green-600">無異常</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactHospitalList;
