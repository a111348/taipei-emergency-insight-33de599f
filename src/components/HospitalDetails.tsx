
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital, getAlertReasons } from "@/data/hospitalData";
import { Users, UserCheck, Clock, Stethoscope, Shield, Heart, AlertTriangle, TrendingUp } from "lucide-react";

interface HospitalDetailsProps {
  hospital: Hospital;
}

const HospitalDetails = ({ hospital }: HospitalDetailsProps) => {
  const alertReasons = getAlertReasons(hospital);

  return (
    <Card className="absolute top-0 left-full ml-4 w-96 z-50 shadow-2xl border-2 border-blue-200 bg-white animate-in slide-in-from-left duration-200">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart size={20} />
          {hospital.name}
        </CardTitle>
        <div className="text-blue-100 text-sm">詳細醫療資訊與指標分析</div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* EDCI 指數與關鍵指標 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">急診壅塞指數</div>
            <div className={`text-3xl font-bold ${
              hospital.status === 'emergency' ? 'text-red-600' : 
              hospital.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
            }`}>
              EDCI: {hospital.edci.toFixed(4)}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
            <div className="text-center p-2 bg-white rounded">
              <div className={`font-semibold ${hospital.adjustedPBR > 80 ? 'text-red-700' : 'text-blue-700'}`}>
                {hospital.adjustedPBR.toFixed(1)}
              </div>
              <div className="text-gray-600 text-xs">醫師壓力比</div>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className={`font-semibold ${hospital.NBR > 40 ? 'text-red-700' : 'text-green-700'}`}>
                {hospital.NBR.toFixed(1)}
              </div>
              <div className="text-gray-600 text-xs">護理壓力比</div>
            </div>
          </div>
        </div>

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
          <div className="text-center mt-2 text-sm font-semibold text-gray-700">
            總計: {hospital.totalPatients} 人
          </div>
        </div>

        {/* 醫護人員與負荷 */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Stethoscope size={16} className="text-blue-500" />
            醫護人員與負荷分析
          </h4>
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">醫師團隊</span>
                <span className="text-xs text-gray-600">FTE: {hospital.effectiveDoctorFTE}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-blue-700">{hospital.attendingPhysicians}</div>
                  <div className="text-gray-600 text-xs">主治醫師</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-700">{hospital.residents}</div>
                  <div className="text-gray-600 text-xs">住院醫師</div>
                </div>
              </div>
              <div className="mt-2 text-center">
                <div className="text-xs text-gray-600">加權病患數</div>
                <div className="font-bold text-blue-800">{hospital.doctorWeightedPatients}</div>
              </div>
            </div>

            <div className="bg-pink-50 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">護理團隊</span>
                <span className="text-xs text-gray-600">人力: {hospital.nurses} 人</span>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600">加權病患數</div>
                <div className="font-bold text-pink-800">{hospital.nurseWeightedPatients}</div>
              </div>
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
              <span className={`font-semibold ${hospital.waitingForAdmission > 30 ? 'text-red-700' : 'text-orange-700'}`}>
                {hospital.waitingForAdmission} 人
              </span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">超過24小時滯留</span>
              <span className={`font-semibold ${hospital.over24Hours > 5 ? 'text-red-700' : 'text-blue-700'}`}>
                {hospital.over24Hours} 人
              </span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">平均轉床時間</span>
              <span className={`font-semibold ${hospital.avgTransferTime > 6 ? 'text-red-700' : 'text-blue-700'}`}>
                {hospital.avgTransferTime} 小時
              </span>
            </div>
          </div>
        </div>

        {/* 問題警示 */}
        {alertReasons.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
              <AlertTriangle size={16} />
              主要問題分析
            </h4>
            <div className="space-y-1">
              {alertReasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-red-700">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HospitalDetails;
