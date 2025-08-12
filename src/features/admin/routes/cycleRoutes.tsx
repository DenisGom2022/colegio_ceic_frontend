import type { RouteObject } from 'react-router-dom';
import { 
  CycleListPage,
  CycleDetailPage,
  CreateCyclePage,
  EditCyclePage
} from '../features/cycles/pages';

export const cycleRoutes: RouteObject[] = [
  {
    path: 'ciclos',
    element: <CycleListPage />
  },
  {
    path: 'ciclo/:id',
    element: <CycleDetailPage />
  },
  {
    path: 'crear-ciclo',
    element: <CreateCyclePage />
  },
  {
    path: 'editar-ciclo/:id',
    element: <EditCyclePage />
  }
];
