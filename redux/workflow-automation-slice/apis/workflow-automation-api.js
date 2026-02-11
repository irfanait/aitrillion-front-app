import { mockFetchWorkflowDashboardStats, mockFetchRecentWorkflows } from "@/utils/mockApi";

export const fetchWorkflowDashboardStats = async () => {
  return { data: await mockFetchWorkflowDashboardStats() };
};

export const fetchRecentWorkflows = async () => {
  return { data: await mockFetchRecentWorkflows() };
};
