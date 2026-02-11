export const mockFetchWorkflowDashboardStats = async () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        activeWorkflows: 5,
        totalEmailSent: 1500,
        totalSmsSent: 300,
        totalWhatsappSent: 120,
        totalPushSent: 400,
        totalOrders: 230,
        totalRevenue: 15400,
        totalCashback: 240,
      });
    }, 400)
  );
};

export const mockFetchRecentWorkflows = async () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        { name: "Welcome Series", status: "Active", trigger: "Signup", lastRun: "2025-09-17" },
        { name: "Abandoned Cart", status: "Active", trigger: "Cart Abandonment", lastRun: "2025-09-15" },
        { name: "Winback Campaign", status: "Paused", trigger: "30 Days Inactive", lastRun: "2025-09-10" },
      ]);
    }, 400)
  );
};
