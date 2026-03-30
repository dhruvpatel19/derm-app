import { HistoryClient } from "@/components/history/history-client";

export const metadata = {
  title: "Learning History - DermEd",
  description:
    "Review your past quiz attempts, case completions, and simulation history.",
};

export default function HistoryPage() {
  return <HistoryClient />;
}
