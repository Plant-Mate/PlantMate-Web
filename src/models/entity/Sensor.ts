export interface SensorData {
    soilMoisture: number;
    temperature: number;
    humidity: number;
    lastUpdated: string;
}

export interface Sensor {
    id: string;
    sensorDatas: SensorData[];
}
