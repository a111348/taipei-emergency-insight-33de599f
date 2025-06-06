
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
}

// 根據EDCI計算狀態
const getStatusFromEDCI = (edci: number): 'emergency' | 'warning' | 'normal' => {
  if (edci >= 85) return 'emergency';
  if (edci >= 65) return 'warning';
  return 'normal';
};

// 生成隨機數據（模擬即時數據）
const generateRandomData = (baseData: Partial<Hospital>): Hospital => {
  const edci = Math.floor(Math.random() * 100) + 20; // 20-120之間
  const totalPatients = Math.floor(Math.random() * 80) + 20; // 20-100之間
  
  return {
    id: baseData.id || '',
    name: baseData.name || '',
    edci,
    status: getStatusFromEDCI(edci),
    totalPatients,
    triageL1: Math.floor(Math.random() * 5) + 1,
    triageL2: Math.floor(Math.random() * 8) + 2,
    triageL3: Math.floor(Math.random() * 15) + 5,
    triageL4: Math.floor(Math.random() * 20) + 8,
    triageL5: Math.floor(Math.random() * 25) + 10,
    attendingPhysicians: Math.floor(Math.random() * 8) + 3,
    residents: Math.floor(Math.random() * 12) + 4,
    nurses: Math.floor(Math.random() * 20) + 10,
    waitingForAdmission: Math.floor(Math.random() * 15) + 2,
    over24Hours: Math.floor(Math.random() * 8),
    avgTransferTime: Math.round((Math.random() * 10 + 2) * 10) / 10, // 2-12小時，一位小數
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
    averageEDCI: Math.round(hospitals.reduce((sum, h) => sum + h.edci, 0) / hospitals.length),
    emergencyCount: hospitals.filter(h => h.status === 'emergency').length,
    warningCount: hospitals.filter(h => h.status === 'warning').length,
    normalCount: hospitals.filter(h => h.status === 'normal').length,
  };
};
