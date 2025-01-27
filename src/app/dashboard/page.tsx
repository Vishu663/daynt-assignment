"use client";
import { JSX } from "react";
import DataTable from "../components/DataTable";
import AuthGuard from "../components/AuthGuard";

export default function DashboardPage(): JSX.Element {
  return (
    <AuthGuard>
      <div className="h-dvh w-full m-0 p-[12px] box-border flex flex-col items-center">
        <h1>Dashboard</h1>
        <DataTable />
      </div>
    </AuthGuard>
  );
}
