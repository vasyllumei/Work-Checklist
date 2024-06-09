import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectType } from '@/types/Project';

interface ProjectState {
  projects: ProjectType[];
}

const initialState: ProjectState = {
  projects: [],
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<ProjectType[]>) {
      state.projects = action.payload;
    },
    setActiveProject(state, action: PayloadAction<string>) {
      state.projects.forEach(project => {
        project.active = project.id === action.payload;
      });
    },
  },
});

export const { setProjects, setActiveProject } = projectSlice.actions;

export default projectSlice.reducer;
