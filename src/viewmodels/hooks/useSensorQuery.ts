import { useQuery } from "@tanstack/react-query";
import { SensorData } from "@/models/entity/Sensor";
import { getSensorData } from "@/services/sensorService";

// 取得指定感測器的所有資料
export const useSensorQuery = (sensorId: string) => {
    return useQuery<SensorData[], Error>({
        queryKey: ["sensorData", sensorId],
        queryFn: () => getSensorData(sensorId),
        enabled: !!sensorId,
    });
};
