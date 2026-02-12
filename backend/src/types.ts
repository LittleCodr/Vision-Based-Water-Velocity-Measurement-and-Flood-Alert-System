import { Request } from 'express';

export interface AuthedUser {
  uid: string;
  email?: string;
  role?: string;
}

export interface AuthedRequest extends Request {
  user?: AuthedUser;
}
