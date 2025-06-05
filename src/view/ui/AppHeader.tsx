import React from "react";
import { AppShell, Group, Title, Button } from "@mantine/core";
import Link from "next/link";
import { IconSquareRoundedPlus, IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface AppHeaderProps {
    onAddClick: () => void;
    showBackButton?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    onAddClick,
    showBackButton = false,
}) => {
    const router = useRouter();

    return (
        <AppShell.Header p="md">
            <Group justify="space-between">
                <Group>
                    <Link
                        href="/"
                        passHref
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Title order={3}>PlantMate</Title>
                    </Link>
                    {showBackButton && (
                        <Button
                            variant="outline"
                            size="compact-xs"
                            leftSection={<IconArrowLeft size={16} />}
                            onClick={() => router.push("/")}
                        >
                            Home
                        </Button>
                    )}
                </Group>
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
