import { useContext } from 'react';
import KanbanContextProps, { KanbanContext } from '@/components/Kanban/providers/kanbanProvider/KanbanContext';

export const useKanbanContext = (): KanbanContextProps => {
  const context = useContext(KanbanContext);

  if (!context) {
    throw new Error('useKanbanContext must be used within a KanbanProvider');
  }

  return context;
};
