
export type IUserToken = {
  id: string;
  email: string;
  role: string;
  sec: string; //means secret/security but contains user password
};


export type INotificationSubscription = {
  endpoint: string;
  expirationTime: string;
  keys: {
    p256dh: string;
    auth: string;
  }
}