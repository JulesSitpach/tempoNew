// Define API keys from environment variables
export const API_KEYS = {
  OPENROUTER: import.meta.env.VITE_OPENROUTER_API_KEY || "",
  SHIPPO: import.meta.env.VITE_SHIPPO_API_KEY || "",
  UN_COMTRADE_PRIMARY: import.meta.env.VITE_UN_COMTRADE_PRIMARY_KEY || "",
  UN_COMTRADE_SECONDARY: import.meta.env.VITE_UN_COMTRADE_SECONDARY_KEY || "",
  SAMGOV: import.meta.env.VITE_SAMGOV_API_KEY || "",
};

// Validate API configuration
export const validateAPIKeys = () => {
  const requiredKeys = ["OPENROUTER", "SHIPPO", "UN_COMTRADE_PRIMARY"];
  const missingKeys = requiredKeys.filter(
    key =>
      !API_KEYS[key as keyof typeof API_KEYS] ||
      API_KEYS[key as keyof typeof API_KEYS].includes("placeholder") ||
      API_KEYS[key as keyof typeof API_KEYS].includes("your-key-here")
  );

  return {
    hasRequiredKeys: missingKeys.length === 0,
    missingKeys,
    totalConfigured: Object.entries(API_KEYS).filter(
      ([key, value]) =>
        value &&
        !value.includes("placeholder") &&
        !value.includes("your-key-here") &&
        requiredKeys.includes(key)
    ).length,
    totalAPIs: requiredKeys.length + 1, // +1 for Federal Register (public)
    issues: missingKeys.map(
      key => `Missing ${key} API key or using placeholder value`
    ),
    configurationHelp:
      "Replace placeholder values with actual API keys in .env.local file",
  };
};
