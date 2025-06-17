// WebSocket configuration
export const WS_CONFIG = {
  // Use window.location for dynamic host detection or provide default
  host: import.meta.env.VITE_WS_HOST || window.location.hostname,
  port:
    import.meta.env.VITE_WS_PORT ||
    (window.location.protocol === "https:" ? 443 : 3000),
  path: import.meta.env.VITE_WS_PATH || "",
  secure: window.location.protocol === "https:",
};

export function getWebSocketUrl(): string {
  const protocol = WS_CONFIG.secure ? "wss:" : "ws:";
  const port = WS_CONFIG.port ? `:${WS_CONFIG.port}` : "";
  return `${protocol}//${WS_CONFIG.host}${port}${WS_CONFIG.path}`;
}
