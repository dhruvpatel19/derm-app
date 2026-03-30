import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata = {
  title: "Progress Dashboard - DermEd",
  description:
    "Track your dermatology learning progress, quiz accuracy, and completed cases.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
