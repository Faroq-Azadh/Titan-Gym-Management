export interface ClubInfoData {
  clubName: string;
  phoneNumber: string;
  email: string;
  city: string;
  address: string;
  about: string;
  gymType?: string;
}

export interface WorkingHourItem {
  id: string;
  title: string;
  openTime: string;
  closeTime: string;
  description?: string;
  enabled: boolean;
}

export interface NotificationSettingItem {
  id: string;
  key: "renewal_reminder" | "welcome_member" | "class_reminder" | "daily_report";
  title: string;
  description: string;
  enabled: boolean;
  lastSent?: string;
}
