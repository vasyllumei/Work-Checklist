import KanbanContextProps, { KanbanContext } from '@/components/Kanban/providers/kanbanProvider/KanbanContext';
import { useContext } from 'react';

export const useKanbanContext = (): KanbanContextProps => {
  const context = useContext(KanbanContext);

  if (!context) {
    throw new Error('useKanbanContext must be used within a KanbanProvider');
  }

  return context;
};
