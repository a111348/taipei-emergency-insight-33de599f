
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital } from "@/data/hospitalData";
import { Users, UserCheck, Clock, Stethoscope, Shield, Heart } from "lucide-react";

interface HospitalDetailsProps {
  hospital: Hospital;
}

const HospitalDetails = ({ hospital }: HospitalDetailsProps) => {
  return (
    <Card className="absolute top-0 left-full ml-4 w-80 z-50 shadow-2xl border-2 border-blue-200 bg-white animate-in slide-in-from-left duration-200">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart size={20} />
          {hospital.name}
        </CardTitle>
        <div className="text-blue-100 text-sm">詳細醫療資訊</div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* 檢傷分級 */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <UserCheck size={16} className="text-red-500" />
            檢傷分級病患數
          </h4>
          <div className="grid grid-cols-5 gap-2 text-xs">
            <div className="text-center p-2 bg-red-100 rounded">
              <div className="font-bold text-red-700">L1</div>
              <div className="text-gray-600">{hospital.triageL1}</div>
            </div>
            <div className="text-center p-2 bg-orange-100 rounded">
              <div className="font-bold text-orange-700">L2</div>
              <div className="text-gray-600">{hospital.triageL2}</div>
            </div>
            <div className="text-center p-2 bg-yellow-100 rounded">
              <div className="font-bold text-yellow-700">L3</div>
              <div className="text-gray-600">{hospital.triageL3}</div>
            </div>
            <div className="text-center p-2 bg-green-100 rounded">
              <div className="font-bold text-green-700">L4</div>
              <div className="text-gray-600">{hospital.triageL4}</div>
            </div>
            <div className="text-center p-2 bg-blue-100 rounded">
              <div className="font-bold text-blue-700">L5</div>
              <div className="text-gray-600">{hospital.triageL5}</div>
            </div>
          </div>
        </div>

        {/* 醫護人員 */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Stethoscope size={16} className="text-blue-500" />
            醫護人員
          </h4>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="font-semibold text-blue-700">{hospital.attendingPhysicians}</div>
              <div className="text-gray-600 text-xs">主治醫師</div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded">
              <div className="font-semibold text-purple-700">{hospital.residents}</div>
              <div className="text-gray-600 text-xs">住院醫師</div>
            </div>
            <div className="text-center p-2 bg-pink-50 rounded">
              <div className="font-semibold text-pink-700">{hospital.nurses}</div>
              <div className="text-gray-600 text-xs">護理師</div>
            </div>
          </div>
        </div>

        {/* 等待與滯留情況 */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Clock size={16} className="text-orange-500" />
            等待與滯留
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">等待住院人數</span>
              <span className="font-semibold text-orange-700">{hospital.waitingForAdmission} 人</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">超過24小時滯留</span>
              <span className="font-semibold text-red-700">{hospital.over24Hours} 人</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">平均轉床時間</span>
              <span className="font-semibold text-blue-700">{hospital.avgTransferTime} 小時</span>
            </div>
          </div>
        </div>

        {/* EDCI 狀態 */}
        <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
          <div className="text-xs text-gray-600 mb-1">急診壅塞指數</div>
          <div className={`
            text-2xl font-bold
            ${hospital.status === 'emergency' ? 'text-red-600' : 
              hospital.status === 'warning' ? 'text-yellow-600' : 'text-green-600'}
          `}>
            EDCI: {hospital.edci}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalDetails;
