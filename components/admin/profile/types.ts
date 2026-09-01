export interface ProfileUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  language: string;
  about: string;
  branch: string;
  memberSince: string;
  avatarUrl?: string;
}

export interface ProfileClubData {
  clubName: string;
  phone: string;
  startHour: string;
  endHour: string;
  address: string;
}

export interface ProfileSecurityData {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  twoFactorEnabled: boolean;
  logoutOtherDevices: boolean;
}

export interface ProfileNotificationData {
  emailNewMembers: boolean;
  alertFailedPayment: boolean;
  smsExpiryReminder: boolean;
  weeklyReport: boolean;
}
