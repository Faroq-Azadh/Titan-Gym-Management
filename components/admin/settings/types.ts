export interface ClubInfoData {
  clubName: string;
  phoneNumber: string;
  email: string;
  city: string;
  address: string;
  about: string;
}

export interface WorkingHourItem {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export interface NotificationSettingItem {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}
