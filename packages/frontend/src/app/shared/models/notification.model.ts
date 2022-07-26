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
  button?: { action: () => void; label: string };
  lifetime?: number;
  close?: () => void;
}
