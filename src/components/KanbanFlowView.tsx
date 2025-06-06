
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hospital } from "@/data/hospitalData";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";

interface KanbanFlowViewProps {
  hospitals: Hospital[];
}

const KanbanFlowView = ({ hospitals }: KanbanFlowViewProps) => {
  const emergencyHospitals = hospitals.filter(h => h.status === 'emergency');
  const warningHospitals = hospitals.filter(h => h.status === 'warning');
  const normalHospitals = hospitals.filter(h => h.status === 'normal');

  const renderHospitalCard = (hospital: Hospital) => (
    <Card key={hospital.id} className="mb-4 bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <h4 className="font-bold text-slate-800 mb-2">{hospital.name}</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">EDCI:</span>
            <span className="font-bold text-slate-800">{hospital.edci.toFixed(1)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">病患:</span>
            <span className="font-bold text-blue-600">{hospital.totalPatients}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">等候:</span>
            <span className="font-bold text-purple-600">{hospital.waitingForAdmission}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 緊急狀態列 */}
      <Card className="bg-red-50 border-red-200">
        <CardHeader className="bg-red-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle size={20} />
            緊急狀態 ({emergencyHospitals.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 max-h-96 overflow-y-auto">
          {emergencyHospitals.length > 0 ? (
            emergencyHospitals.map(renderHospitalCard)
          ) : (
            <div className="text-center text-slate-500 py-8">
              <CheckCircle size={32} className="mx-auto mb-2 text-slate-400" />
              <p>無緊急狀態醫院</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 警示狀態列 */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader className="bg-amber-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Clock size={20} />
            警示狀態 ({warningHospitals.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 max-h-96 overflow-y-auto">
          {warningHospitals.length > 0 ? (
            warningHospitals.map(renderHospitalCard)
          ) : (
            <div className="text-center text-slate-500 py-8">
              <CheckCircle size={32} className="mx-auto mb-2 text-slate-400" />
              <p>無警示狀態醫院</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 正常狀態列 */}
      <Card className="bg-emerald-50 border-emerald-200">
        <CardHeader className="bg-emerald-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle size={20} />
            正常狀態 ({normalHospitals.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 max-h-96 overflow-y-auto">
          {normalHospitals.length > 0 ? (
            normalHospitals.map(renderHospitalCard)
          ) : (
            <div className="text-center text-slate-500 py-8">
              <AlertTriangle size={32} className="mx-auto mb-2 text-slate-400" />
              <p>無正常狀態醫院</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KanbanFlowView;
