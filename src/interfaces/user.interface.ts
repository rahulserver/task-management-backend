export interface IUser {
  id: string; // Firebase UID
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastLogin: Date;
}
