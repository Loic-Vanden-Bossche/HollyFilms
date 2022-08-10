export interface SystemMetrics {
  cpu: CpuMetrics;
  disks: DiskMetrics[];
  mem: MemoryMetrics;
  uptime: number;
}

export interface MemoryMetrics {
  used: number;
  available: number;
  total: number;
}

export interface CpuMetrics {
  maxTemp: number;
  temp: number;
  usage: number;
}

export interface DiskMetrics {
  used: number;
  use: number;
  available: number;
  size: number;
}
