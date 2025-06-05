import { SensorData } from "@/models/entity/Sensor";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SENSOR_KEY = "plantmate_sensors";

// export const getSensorData = async (id: string): Promise<SensorData[]> => {
//     const res = await fetch(`${BACKEND_URL}/api/sensors/${id}`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//     });

//     if (!res.ok) throw new Error("Failed to fetch");
//     console.log("Fetching sensor data for ID: ", id);

//     const data = await res.json();
//     return data.map((d) => ({
//         id: d.sensor_id as string,
//         temperature: d.temperature as number,
//         humidity: d.humidity as number,
//         soilMoisture: d.soil_moisture as number,
//     }));
// };

// 獲取感測器數據
export const getSensorData = async (id: string): Promise<SensorData[]> => {
    const sensorKey = `${SENSOR_KEY}_${id}`;
    const data = localStorage.getItem(sensorKey);

    if (!data) {
        // 隨機產生 5~15 筆模擬數據
        const count = Math.floor(Math.random() * 11) + 5;
        await generateMockSensorData(id, count);
        const newData = localStorage.getItem(sensorKey);
        return newData ? JSON.parse(newData) : [];
    }

    return JSON.parse(data);
};

// 生成模擬感測器數據
export const generateMockSensorData = async (
    id: string,
    count: number = 1
): Promise<void> => {
    const sensorKey = `${SENSOR_KEY}_${id}`;
    const prevData = localStorage.getItem(sensorKey);
    const dataList = prevData ? JSON.parse(prevData) : [];

    for (let i = 0; i < count; i++) {
        const newSensorData = {
            soilMoisture: Math.floor(Math.random() * 100),
            temperature: Math.floor(Math.random() * 15) + 20, // 20-35℃
            humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
            lastUpdated: new Date(
                Date.now() - (count - i - 1) * 3600 * 1000
            ).toISOString(), // 時間往前推
        };
        dataList.push(newSensorData);
    }
    localStorage.setItem(sensorKey, JSON.stringify(dataList));
    return dataList;
};
