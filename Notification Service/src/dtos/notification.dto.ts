export type NotificationDTO = {
  to: string;
  subject: string;
  templateId: string;
  params: Record<string, any>; // pararmeters to replace in this template
};
