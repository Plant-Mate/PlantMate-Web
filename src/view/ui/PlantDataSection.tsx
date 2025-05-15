import React, { useState } from "react";
import { Paper, Select, Text, Stack, Grid } from "@mantine/core";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    TooltipProps,
} from "recharts";

// 定義歷史數據的類型
interface SensorHistoryData {
    date: string;
    soilMoisture: number;
    temperature: number;
    humidity: number;
    [key: string]: string | number;
}

// 模擬歷史數據生成函數
const generateMockData = (days: number): SensorHistoryData[] => {
    const data: SensorHistoryData[] = [];
    const now = new Date();

    for (let i = 0; i < days; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        data.unshift({
            date: date.toISOString().split("T")[0],
            displayDate: `${date.getMonth() + 1}/${date.getDate()}`, // 添加格式化後的日期用於顯示
            soilMoisture: Math.floor(Math.random() * 40) + 40, // 40-80%
            temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
            humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        });
    }

    return data;
};

// 格式化日期函數，根據時間範圍選擇合適的顯示格式
const formatDate = (dateString: string, timeRange: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
};

interface PlantDataSectionProps {
    plantId: string;
}

export const PlantDataSection: React.FC<PlantDataSectionProps> = ({
    plantId,
}) => {
    const [timeRange, setTimeRange] = useState("7");

    const historicalData = generateMockData(parseInt(timeRange));

    // 計算要顯示的刻度數量
    const getTickCount = (totalItems: number) => {
        if (totalItems <= 7) return totalItems;
        if (totalItems <= 14) return Math.ceil(totalItems / 2);
        return Math.ceil(totalItems / 5);
    };

    // 自訂 Tooltip 內容
    const CustomTooltip = ({
        active,
        payload,
        label,
    }: TooltipProps<any, any>) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
                    <p className="font-bold">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={`item-${index}`} style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                            {entry.name === "溫度" ? "°C" : "%"}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const renderMetricChart = (
        metricKey: "soilMoisture" | "temperature" | "humidity",
        title: string,
        color: string
    ) => {
        if (historicalData.length === 0) return <div>加載中...</div>;

        const currentValue =
            historicalData[historicalData.length - 1][metricKey];
        const prevValue = historicalData[0][metricKey];
        const change = currentValue - prevValue;
        const isPositive = change > 0;

        // 取得第一天的日期顯示
        const firstDayFormatted = formatDate(historicalData[0].date, timeRange);

        // 決定要顯示的刻度數量
        const tickCount = getTickCount(historicalData.length);

        return (
            <Stack>
                <div>
                    <Text fw={700} size="lg" mb={5}>
                        {title}
                    </Text>
                    <Text size="xl" fw={700}>
                        {currentValue}
                        {metricKey === "temperature" ? "°C" : "%"}
                    </Text>
                    <Text size="xs" c={isPositive ? "green" : "red"}>
                        {isPositive ? "↑" : "↓"} {Math.abs(change).toFixed(1)}
                        {metricKey === "temperature" ? "°C" : "%"} 相較於{" "}
                        {firstDayFormatted}
                    </Text>
                </div>

                <div className="h-64 w-full mt-3">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={historicalData}
                            margin={{
                                top: 10,
                                right: 0,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="displayDate"
                                tick={{ fontSize: 12 }}
                                tickMargin={8}
                                tickCount={tickCount}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickMargin={8}
                                domain={
                                    metricKey === "temperature"
                                        ? ["dataMin - 2", "dataMax + 2"]
                                        : [0, 100]
                                }
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey={metricKey}
                                name={title}
                                stroke={color}
                                fill={color}
                                fillOpacity={0.2}
                                activeDot={{ r: 6 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Stack>
        );
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Select
                    value={timeRange}
                    onChange={(value) => setTimeRange(value || "7")}
                    data={[
                        { value: "7", label: "最近一週" },
                        { value: "14", label: "最近兩週" },
                        { value: "30", label: "最近一個月" },
                    ]}
                    className="w-40"
                />
            </div>

            <Grid>
                <Grid.Col span={{ base: 12, md: 12 }}>
                    <Paper withBorder p="md">
                        {renderMetricChart(
                            "soilMoisture",
                            "土壤濕度",
                            "#3498db"
                        )}
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 12 }}>
                    <Paper withBorder p="md">
                        {renderMetricChart("temperature", "溫度", "#e74c3c")}
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 12 }}>
                    <Paper withBorder p="md">
                        {renderMetricChart("humidity", "空氣濕度", "#2ecc71")}
                    </Paper>
                </Grid.Col>
            </Grid>
        </div>
    );
};
