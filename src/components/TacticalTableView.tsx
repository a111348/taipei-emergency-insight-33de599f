
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hospital } from "@/data/hospitalData";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

interface TacticalTableViewProps {
  hospitals: Hospital[];
}

const TacticalTableView = ({ hospitals }: TacticalTableViewProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'emergency': return <AlertTriangle className="text-red-600" size={20} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={20} />;
      case 'normal': return <CheckCircle className="text-emerald-600" size={20} />;
      default: return <Shield className="text-slate-600" size={20} />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'emergency': return 'bg-red-900 text-red-100';
      case 'warning': return 'bg-amber-800 text-amber-100';
      case 'normal': return 'bg-emerald-800 text-emerald-100';
      default: return 'bg-slate-800 text-slate-100';
    }
  };

  return (
    <Card className="bg-slate-900 text-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600">
        <CardTitle className="text-2xl flex items-center gap-3 text-green-400">
          <Shield size={28} />
          戰術監控表格
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr className="border-b border-slate-600">
                <th className="text-left p-4 font-bold text-green-400">狀態</th>
                <th className="text-left p-4 font-bold text-green-400">醫院</th>
                <th className="text-center p-4 font-bold text-green-400">EDCI</th>
                <th className="text-center p-4 font-bold text-green-400">病患</th>
                <th className="text-center p-4 font-bold text-green-400">等候</th>
                <th className="text-center p-4 font-bold text-green-400">醫師壓力</th>
                <th className="text-center p-4 font-bold text-green-400">護理壓力</th>
                <th className="text-center p-4 font-bold text-green-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.sort((a, b) => b.edci - a.edci).map((hospital, index) => (
                <tr 
                  key={hospital.id} 
                  className={`border-b border-slate-700 hover:bg-slate-800 transition-colors ${
                    index % 2 === 0 ? 'bg-slate-900' : 'bg-slate-850'
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(hospital.status)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white">{hospital.name}</div>
                  </td>
                  <td className="p-4 text-center">
                    <Badge className={`${getStatusBg(hospital.status)} font-black text-lg px-3 py-1`}>
                      {hospital.edci.toFixed(1)}
                    </Badge>
                  </td>
                  <td className="p-4 text-center font-bold text-blue-400">
                    {hospital.totalPatients}
                  </td>
                  <td className="p-4 text-center font-bold text-purple-400">
                    {hospital.waitingForAdmission}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-bold ${
                      hospital.adjustedPBR > 80 ? 'text-red-400' : 'text-cyan-400'
                    }`}>
                      {hospital.adjustedPBR.toFixed(0)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-bold ${
                      hospital.NBR > 40 ? 'text-red-400' : 'text-cyan-400'
                    }`}>
                      {hospital.NBR.toFixed(0)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-bold transition-colors">
                      詳情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TacticalTableView;
