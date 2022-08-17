export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
  Neutral = 'neutral',
}

export interface Notification {
  id?: string;
  message: string;
  type: NotificationType;
  buttons: { action: () => void; label: string }[];
  lifetime: number | null;
  close?: () => void;
}
