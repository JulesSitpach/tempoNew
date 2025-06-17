import { API_KEYS, validateAPIKeys } from "./apiConfig";

export const setupAPIs = async (): Promise<{
  success: boolean;
  issues: string[];
}> => {
  const issues: string[] = [];
  let success = true;

  // Validate API keys configuration
  const apiStatus = validateAPIKeys();

  console.log(
    `API Configuration: ${apiStatus.totalConfigured}/${apiStatus.totalAPIs} APIs configured`
  );

  if (!apiStatus.hasRequiredKeys) {
    console.warn("🔧 API Configuration Issues:", apiStatus.issues);
    console.info("📖 Configuration Help:", apiStatus.configurationHelp);
    issues.push(...apiStatus.issues);
    success = false;
  } else {
    console.info("✅ All required API keys are configured");
  }

  // Notify the UI of API status
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("api-status-update", {
        detail: {
          success,
          issues,
          requiredAPIsConfigured: apiStatus.hasRequiredKeys,
          openRouterReady: success,
        },
      })
    );
  }

  return { success, issues };
};
