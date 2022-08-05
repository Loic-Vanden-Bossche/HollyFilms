export interface SystemMetrics {
  cpu: { maxTemp: number; temp: number; usage: number };
  disks: Array<{
    used: number;
    use: number;
    available: number;
    size: number;
  }>;
  mem: {
    used: number;
    available: number;
    total: number;
  };
  uptime: number;
}
