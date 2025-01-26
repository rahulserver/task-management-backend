export interface BaseDocument {
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Firebase user ID
}
