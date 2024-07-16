import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ProjectType } from '@/types/Project';
import { getProjectById } from '@/services/project/projectService';
import { Layout } from '@/components/Layout';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/Kanban/components/StrictDroppable/StrictModeDroppable';
import { ColumnType } from '@/types/Column';
import { ColumnTitleEdit } from '@/components/Configs/components/ProjectConfig/ColumnTitleEdit/ColumnTitleEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DeleteModal } from '@/components/modals/DeleteModal/DeleteModal';
import { createColumn, deleteColumn, getAllColumns } from '@/services/column/columnService';
import { useDialogControl } from '@/hooks/useDialogControl';
import styles from './ProjectConfig.module.css';
import ConfigActions from '@/components/Configs/components/ProjectConfig/components/ConfigActions/ConfigActions';
import { useFormik } from 'formik';
import { columnValidationSchema } from '@/components/Configs/utils';
import { handleColumnDragEnd } from '@/components/Configs/components/ProjectConfig/utils/onDragEndColumn';

const initialColumnForm = {
  title: '',
  order: 0,
  id: '',
  projectId: '',
};
export const ProjectConfig = () => {
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [isAddStatusModalOpen, setIsAddStatusModalOpen] = useState<boolean>(false);
  const [project, setProject] = useState<ProjectType | null>(null);

  const { isOpen: isDialogOpen, openDialog: openProjectDialog, closeDialog: closeProjectDialog } = useDialogControl();
  const router = useRouter();
  const { projectId } = router.query;

  const formik = useFormik({
    initialValues: initialColumnForm,
    validationSchema: columnValidationSchema,
    onSubmit: async () => {
      try {
        await handleColumnCreate();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });

  const fetchProject = async () => {
    try {
      if (projectId && typeof projectId === 'string') {
        const response = await getProjectById(projectId);
        console.log('Response data:', response.data);
        setProject(response.data);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const fetchColumns = async (projectId: string) => {
    try {
      const { data: columnsData } = await getAllColumns(projectId);
      const columnToRender = columnsData.filter(column => column.title !== 'Backlog');
      setColumns(columnToRender.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching columns:', error);
    }
  };

  const handleColumnCreate = async () => {
    try {
      if (formik.isValid) {
        const columnData = await createColumn({ ...formik.values, projectId: projectId as string });
        setColumns(prevColumns => [...prevColumns, columnData]);
        fetchColumns(projectId as string);
      }
    } catch (error) {
      console.error('Error creating column:', error);
    }
  };

  const handleColumnDelete = async (columnId: string) => {
    try {
      await deleteColumn(columnId);
      await fetchColumns(projectId as string);
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchColumns(projectId as string);
  }, [projectId]);

  const handleOpenDeleteColumnModal = (columnId: string) => {
    setSelectedColumn(columnId);
    openProjectDialog();
  };

  const handleCloseDeleteColumnModal = () => {
    setSelectedColumn('');
    closeProjectDialog();
  };

  const handleAddStatus = () => {
    handleColumnCreate();
    handleCloseColumnModal();
  };

  const handleOpenColumnModal = () => {
    formik.resetForm();
    setIsAddStatusModalOpen(true);
  };

  const handleCloseColumnModal = () => {
    formik.resetForm();
    setIsAddStatusModalOpen(false);
  };

  const handleColumnDragEndLocal = (result: DropResult) => {
    handleColumnDragEnd(columns, setColumns, result);
  };
  return (
    <Layout
      headTitle="Configs"
      breadcrumbs={[
        { title: 'Dashboard', link: '/' },
        { title: 'Configs', link: '/configs' },
        { title: `Project ${project?.title}`, link: `/${projectId}` },
      ]}
    >
      {project && (
        <div>
          <div className={styles.projectTitleName} style={{ color: project?.color }}>
            {project.title}
            <ConfigActions
              projectId={projectId}
              formik={formik}
              isAddStatusModalOpen={isAddStatusModalOpen}
              openAddStatusModal={handleOpenColumnModal}
              closeAddStatusModal={handleCloseColumnModal}
              handleAddStatus={handleAddStatus}
            />
          </div>

          <DragDropContext onDragEnd={handleColumnDragEndLocal}>
            <StrictModeDroppable droppableId="columnContainer" type="COLUMN" direction="vertical">
              {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef} className={styles.columnContainer}>
                  {columns.map((column, index) => (
                    <Draggable key={column.id} draggableId={column.id ? column.id.toString() : ''} index={index}>
                      {provided => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className={styles.columnBox}
                          data-testid={`column${column.id}`}
                        >
                          <div className={styles.column}>
                            <div className={styles.columnHead}>
                              <h2 className={styles.columnTitle}>
                                <ColumnTitleEdit column={column} />
                              </h2>
                              <button
                                className={styles.deleteStatusButton}
                                onClick={() => handleOpenDeleteColumnModal(column.id)}
                              >
                                <DeleteIcon color="primary" />
                              </button>
                              <DeleteModal
                                title="Delete Column"
                                item={`column "${selectedColumn}"`}
                                isOpen={isDialogOpen}
                                onClose={handleCloseDeleteColumnModal}
                                onDelete={async () => await handleColumnDelete(selectedColumn)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </StrictModeDroppable>
          </DragDropContext>
        </div>
      )}
    </Layout>
  );
};

export default ProjectConfig;
