import { configureStore } from '@reduxjs/toolkit';
import projectReducer from '@/store/projectStore/projectReducer/projectReducers';
const store = configureStore({
  reducer: {
    project: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
