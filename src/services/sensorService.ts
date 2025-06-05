import { SensorData } from "@/models/entity/Sensor";
const SENSOR_KEY = "plantmate_sensors";

// 獲取感測器數據
export const getSensorData = async (id: string): Promise<SensorData[]> => {
    const sensorKey = `${SENSOR_KEY}_${id}`;
    const data = localStorage.getItem(sensorKey);

    if (!data) {
        await generateMockSensorData(id);
        return [];
    }

    return JSON.parse(data);
};

// 生成模擬感測器數據
export const generateMockSensorData = async (id: string): Promise<void> => {
    const sensorKey = `${SENSOR_KEY}_${id}`;
    const prevData = localStorage.getItem(sensorKey);
    const dataList = prevData ? JSON.parse(prevData) : [];

    const newSensorData = {
        soilMoisture: Math.floor(Math.random() * 100),
        temperature: Math.floor(Math.random() * 15) + 20, // 20-35℃
        humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
        lastUpdated: new Date().toISOString(),
    };

    dataList.push(newSensorData);
    localStorage.setItem(sensorKey, JSON.stringify(dataList));

    return dataList;
};
