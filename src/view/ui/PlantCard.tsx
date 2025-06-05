import React, { useState } from "react";
import { Card, Text, Button, Group, Modal, TextInput } from "@mantine/core";
import { Plant } from "../../models/entity/Plant";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { useSensorQuery } from "@/viewmodels/hooks/useSensorQuery";

interface PlantCardProps {
    plant: Plant;
    onLinkSensor: (plantId: string, sensorId: string) => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({
    plant,
    onLinkSensor,
}) => {
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [sensorId, setSensorId] = useState(plant.sensorId);

    const { data: sensorDataList } = useSensorQuery(sensorId ?? "");

    const handleLinkSensor = () => {
        if (!sensorId) return;

        onLinkSensor(plant._id, sensorId);
        setLinkModalOpen(false);
    };

    return (
        <>
            <Card
                shadow="sm"
                radius="md"
                withBorder
                className="w-full max-w-lg"
            >
                <Card.Section className="p-4">
                    <div className="flex justify-between">
                        <div>
                            <Text size="xl" fw={700}>
                                {plant.name}
                            </Text>
                            <Text size="sm" c="dimmed">
                                {plant.species}
                            </Text>

                            {plant.sensorId &&
                                sensorDataList &&
                                sensorDataList.length > 0 && (
                                    <div className="mt-4 space-y-1">
                                        <Text size="sm">
                                            土壤濕度:{" "}
                                            {
                                                sensorDataList.at(-1)
                                                    ?.soilMoisture
                                            }
                                            %
                                        </Text>
                                        <Text size="sm">
                                            溫度:{" "}
                                            {sensorDataList.at(-1)?.temperature}
                                            °C
                                        </Text>
                                        <Text size="sm">
                                            空氣濕度:{" "}
                                            {sensorDataList.at(-1)?.humidity}%
                                        </Text>
                                    </div>
                                )}
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                            <Link href={`/plant/${plant._id}`} passHref>
                                <Button variant="subtle" size="sm">
                                    <IconArrowRight
                                        size={20}
                                        color="#63687c"
                                        strokeWidth={3}
                                    />
                                </Button>
                            </Link>

                            {!plant.sensorId && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    color="#0bae4a"
                                    onClick={() => setLinkModalOpen(true)}
                                >
                                    連結感測器
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Section>
            </Card>

            <Modal
                opened={linkModalOpen}
                onClose={() => setLinkModalOpen(false)}
                title="連結感測器"
            >
                <div className="space-y-4">
                    <TextInput
                        label="感測器 ID"
                        value={sensorId ?? ""}
                        onChange={(e) => setSensorId(e.target.value)}
                        placeholder="   "
                    />
                    <Group justify="flex-end">
                        <Button
                            variant="default"
                            onClick={() => setLinkModalOpen(false)}
                        >
                            取消
                        </Button>
                        <Button onClick={handleLinkSensor}>確認</Button>
                    </Group>
                </div>
            </Modal>
        </>
    );
};
