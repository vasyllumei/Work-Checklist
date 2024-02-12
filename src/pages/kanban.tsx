import { Kanban } from '@/components/Kanban/Kanban';
import { KanbanProvider } from '@/components/Kanban/providers/kanbanProvider/KanbanContext';

const KanbanPage = () => {
  return (
    <KanbanProvider>
      <Kanban />
    </KanbanProvider>
  );
};

export default KanbanPage;
