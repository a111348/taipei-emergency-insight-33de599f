
export interface Hospital {
  id: string;
  name: string;
  edci: number;
  status: 'emergency' | 'warning' | 'normal';
  totalPatients: number;
  triageL1: number;
  triageL2: number;
  triageL3: number;
  triageL4: number;
  triageL5: number;
  attendingPhysicians: number;
  residents: number;
  nurses: number;
  waitingForAdmission: number;
  over24Hours: number;
  avgTransferTime: number;
  // 新增字段
  doctorWeightedPatients: number;
  effectiveDoctorFTE: number;
  adjustedPBR: number;
  nurseWeightedPatients: number;
  NBR: number;
}

// 根據新的EDCI標準計算狀態
const getStatusFromEDCI = (edci: number): 'emergency' | 'warning' | 'normal' => {
  if (edci > 20) return 'emergency';
  if (edci >= 15) return 'warning';
  return 'normal';
};

// 生成隨機數據（模擬即時數據）
const generateRandomData = (baseData: Partial<Hospital>): Hospital => {
  const edci = Math.round((Math.random() * 25 + 5) * 10000) / 10000; // 5-30之間，4位小數
  const totalPatients = Math.floor(Math.random() * 80) + 20; // 20-100之間
  
  const triageL1 = Math.floor(Math.random() * 15) + 1;
  const triageL2 = Math.floor(Math.random() * 40) + 10;
  const triageL3 = Math.floor(Math.random() * 50) + 15;
  const triageL4 = Math.floor(Math.random() * 10);
  const triageL5 = Math.floor(Math.random() * 5);
  
  const attendingPhysicians = Math.floor(Math.random() * 3) + 1;
  const residents = Math.floor(Math.random() * 3) + 1;
  const nurses = Math.floor(Math.random() * 8) + 2;
  
  const doctorWeightedPatients = Math.floor(Math.random() * 200) + 100;
  const effectiveDoctorFTE = Math.round((Math.random() * 2 + 1) * 10) / 10;
  const adjustedPBR = Math.round((doctorWeightedPatients / effectiveDoctorFTE) * 1000) / 1000;
  const nurseWeightedPatients = Math.floor(Math.random() * 150) + 50;
  const NBR = Math.round((nurseWeightedPatients / nurses) * 10) / 10;

  return {
    id: baseData.id || '',
    name: baseData.name || '',
    edci,
    status: getStatusFromEDCI(edci),
    totalPatients: triageL1 + triageL2 + triageL3 + triageL4 + triageL5,
    triageL1,
    triageL2,
    triageL3,
    triageL4,
    triageL5,
    attendingPhysicians,
    residents,
    nurses,
    waitingForAdmission: Math.floor(Math.random() * 50) + 10,
    over24Hours: Math.floor(Math.random() * 8),
    avgTransferTime: Math.round((Math.random() * 8 + 2) * 10) / 10,
    doctorWeightedPatients,
    effectiveDoctorFTE,
    adjustedPBR,
    nurseWeightedPatients,
    NBR,
  };
};

const hospitalNames = [
  { id: 'linkou-chang-gung', name: '林口長庚醫院' },
  { id: 'taoyuan-hospital', name: '部桃園醫院' },
  { id: 'veterans-taoyuan', name: '榮民醫院桃園分院' },
  { id: 'military-hospital', name: '國軍醫院' },
  { id: 'st-paul', name: '聖保祿醫院' },
  { id: 'min-sheng', name: '敏盛醫院' },
  { id: 'landseed', name: '聯新醫院' },
  { id: 'tian-sheng', name: '天晟醫院' },
  { id: 'taoyuan-xinwu', name: '部桃醫院新屋分院' },
  { id: 'tian-cheng', name: '天成醫院' },
  { id: 'e-jen', name: '怡仁醫院' }
];

export const getHospitalData = (): Hospital[] => {
  return hospitalNames.map(hospital => generateRandomData(hospital));
};

// 分析超標原因
export const getAlertReasons = (hospital: Hospital): string[] => {
  const reasons: string[] = [];
  
  if (hospital.adjustedPBR > 80) {
    reasons.push(`醫師壓力比過高 (${hospital.adjustedPBR.toFixed(1)})`);
  }
  
  if (hospital.NBR > 40) {
    reasons.push(`護理壓力比過高 (${hospital.NBR.toFixed(1)})`);
  }
  
  if (hospital.waitingForAdmission > 30) {
    reasons.push(`等待住院人數過多 (${hospital.waitingForAdmission}人)`);
  }
  
  if (hospital.over24Hours > 5) {
    reasons.push(`長時間滯留患者過多 (${hospital.over24Hours}人)`);
  }
  
  if (hospital.avgTransferTime > 6) {
    reasons.push(`轉床時間過長 (${hospital.avgTransferTime}小時)`);
  }
  
  return reasons;
};

// 獲取特定醫院數據
export const getHospitalById = (id: string): Hospital | undefined => {
  const hospitals = getHospitalData();
  return hospitals.find(h => h.id === id);
};

// 獲取緊急狀態醫院
export const getEmergencyHospitals = (): Hospital[] => {
  return getHospitalData().filter(h => h.status === 'emergency');
};

// 計算總計數據
export const getTotalStats = () => {
  const hospitals = getHospitalData();
  return {
    totalPatients: hospitals.reduce((sum, h) => sum + h.totalPatients, 0),
    totalWaiting: hospitals.reduce((sum, h) => sum + h.waitingForAdmission, 0),
    averageEDCI: Math.round(hospitals.reduce((sum, h) => sum + h.edci, 0) / hospitals.length * 10000) / 10000,
    emergencyCount: hospitals.filter(h => h.status === 'emergency').length,
    warningCount: hospitals.filter(h => h.status === 'warning').length,
    normalCount: hospitals.filter(h => h.status === 'normal').length,
  };
};
