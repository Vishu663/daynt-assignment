"use client";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import authService from "../services/authService";
import { JSX } from "react";
import DataTable from "../components/DataTable";

export default function DashboardPage(): JSX.Element {
  const router = useRouter();

  const handleLogout = (): void => {
    authService.logout();
    router.push("/");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <DataTable />
      <Button
        onClick={handleLogout}
        variant="contained"
        color="error"
        fullWidth
        sx={{ mt: 2 }}
      >
        Logout
      </Button>
    </div>
  );
}
