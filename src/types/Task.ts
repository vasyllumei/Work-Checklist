export type TaskType = {
  id: string;
  userId: string;
  assignedTo?: string;
  title: string;
  description: string;
  statusId: string;
  buttonState: ButtonStateType;
  image?: string;
  avatar?: any;
  order: number;
};

export enum ButtonStateType {
  Pending = 'Pending',
  Updates = 'Updates',
  Errors = 'Errors',
  Done = 'Done',
}
