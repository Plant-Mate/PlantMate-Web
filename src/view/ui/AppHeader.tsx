import React from "react";
import { AppShell, Group, Title, Button } from "@mantine/core";
import Link from "next/link";
import { IconSquareRoundedPlus } from "@tabler/icons-react";
interface AppHeaderProps {
    onAddClick: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onAddClick }) => {
    return (
        <AppShell.Header p="md">
            <Group justify="space-between">
                <Link
                    href="/"
                    passHref
                    style={{ textDecoration: "none", color: "inherit" }}
                >
                    <Title order={3}>PlantMate</Title>
                </Link>
                <Button
                    onClick={onAddClick}
                    leftSection={<IconSquareRoundedPlus size={18} />}
                    variant="primary"
                    bg={"#7b594e"}
                >
                    新增植物
                </Button>
            </Group>
        </AppShell.Header>
    );
};
