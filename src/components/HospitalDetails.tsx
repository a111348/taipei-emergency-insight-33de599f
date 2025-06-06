import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital, getAlertReasons } from "@/data/hospitalData";
import { Users, UserCheck, Clock, Stethoscope, Shield, Heart, AlertTriangle, TrendingUp } from "lucide-react";

interface HospitalDetailsProps {
  hospital: Hospital;
}

const HospitalDetails = ({ hospital }: HospitalDetailsProps) => {
  const alertReasons = getAlertReasons(hospital);

  return (
    <Card className="absolute top-0 left-full ml-6 w-[420px] z-50 shadow-2xl border-4 border-blue-300 bg-white/98 backdrop-blur-sm animate-in slide-in-from-left duration-300">
      <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white pb-4">
        <CardTitle className="text-xl flex items-center gap-3 font-bold">
          <Heart size={24} className="text-red-400" />
          {hospital.name}
        </CardTitle>
        <div className="text-slate-200 text-sm font-medium">詳細醫療資訊與指標分析</div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* EDCI 指數與關鍵指標 - 大螢幕優化 */}
        <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl p-4 border-2 border-slate-300">
          <div className="text-center">
            <div className="text-sm text-slate-700 mb-2 font-semibold">急診壅塞指數</div>
            <div className={`text-4xl font-black tracking-tight ${
              hospital.status === 'emergency' ? 'text-red-700' : 
              hospital.status === 'warning' ? 'text-amber-600' : 'text-emerald-700'
            }`}>
              EDCI: {hospital.edci.toFixed(2)}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div className="text-center p-3 bg-white rounded-lg border-2 border-slate-200">
              <div className={`font-black text-lg ${hospital.adjustedPBR > 80 ? 'text-red-700' : 'text-slate-700'}`}>
                {hospital.adjustedPBR.toFixed(1)}
              </div>
              <div className="text-slate-600 text-sm font-medium">醫師壓力比</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border-2 border-slate-200">
              <div className={`font-black text-lg ${hospital.NBR > 40 ? 'text-red-700' : 'text-emerald-700'}`}>
                {hospital.NBR.toFixed(1)}
              </div>
              <div className="text-slate-600 text-sm font-medium">護理壓力比</div>
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

        {/* 問題警示 - 增強大螢幕可見度 */}
        {alertReasons.length > 0 && (
          <div className="bg-red-100 border-2 border-red-300 rounded-xl p-4">
            <h4 className="font-black text-red-800 mb-3 flex items-center gap-2 text-base">
              <AlertTriangle size={20} />
              主要問題分析
            </h4>
            <div className="space-y-2">
              {alertReasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-red-600 rounded-full mt-1 flex-shrink-0"></div>
                  <span className="text-sm text-red-800 font-medium">{reason}</span>
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
