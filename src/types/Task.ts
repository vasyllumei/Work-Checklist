export type TaskType = {
  id: string;
  userId: string;
  assignedTo: string;
  title: string;
  description: string;
  statusId: string;
  buttonState: string;
  image?: string;
  avatar?: string;
  order: number;
};
