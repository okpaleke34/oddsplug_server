import mongoose, { Document, Schema } from 'mongoose';

export type IAuthenticationOptional = Partial<IAuthentication>;

export interface IAuthentication extends Document {
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

const authenticationSchema: Schema = new Schema({
  email: { type: String, required: false, unique: false },
  dialingCode: { type: String, required: false },
  username: { type: String, required: false },
  mobile: { type: String, required: false },
  password: { type: String, required: false },
  devices: { type: Object, required: false },
  Oauth: { type: Object, required: false, comment: "Extra data about the student from third party OAuth {name,email,image,service:'google,facebook,github'}"},
  isOAuth: { type: Boolean, required: false, default:false, comment: "if user is authenticated via third party OAuth"},
  JWT: { type: String, required: false, comment: "JWT token stored in the browser, this makes it one device login at a time."},
  role: { type: String, required: true, enum: ['user', 'admin'] },
},
{ timestamps: true });

export default mongoose.model<IAuthentication>('authentication', authenticationSchema);