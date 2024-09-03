
type IDevice = {
    model: string;
    firstLogin: Date;
    lastLogin: Date;
    location: string;
    browser: string;
    // os: string;
    ip: string;
    type: string;//mobile, desktop, tablet
    useragent:string;
    notificationSubscription: INotificationSubscription | any;
    status: 0 | 1;
}
  
type INotificationSubscription = {
    endpoint: string;
    expirationTime: string;
    keys: {
      p256dh: string;
      auth: string;
    }
}

export type IUserDTO = {
    _id?: any;
    email?: string;
    mobile?: string;
    username?: string;
    dialingCode?: string;
    password?: string;
    OAuth?: {name:string,email:string,image:string,service:string};
    isOAuth?: boolean;
    JWT?: string;
    devices?: IDevice[];
    role: 'user' | 'admin';
}

export type IResponse = {
    status: boolean;
    message?: string;
    data?: any;
}