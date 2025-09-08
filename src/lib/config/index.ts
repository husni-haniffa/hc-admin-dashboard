// Application configuration
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 10000,
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  features: {
    enableDarkMode: false,
    enableNotifications: true,
    enableSearch: true,
  },
  ui: {
    toastDuration: 4000,
    debounceDelay: 300,
  },
} as const;

// Environment validation
export function validateEnvironment() {
  const requiredEnvVars: string[] = [
    // Add required environment variables here
  ];

  const missing = requiredEnvVars.filter((envVar: string) => !process.env[envVar]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}