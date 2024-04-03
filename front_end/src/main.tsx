import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import IndexPage from './routes';
import URSFichePage from './routes/projects/urs/fiche';
import Layout from '~/components/layout';
import ProjetsPage from '~/routes/projects';
import UsersPage from '~/routes/users';
import { Toaster } from 'sonner';
import axios from 'axios';
import ProjectPage from '~/routes/projects/details';

import type {
  CategoryStepCompleteDto,
  ProjectDetailedDto,
  ProjectDto,
  URSDto,
} from 'backend-types';

import './index.css';
import '@fontsource-variable/inter';
import StepPage from '~/routes/projects/steps/details';
import ProjectDiagramPage from '~/routes/projects/diagram';
import DatabasePage from '~/routes/database';

const queryClient = new QueryClient();

const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.baseURL = API_URL;

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
      <TanStackRouterDevtools />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: UsersPage,
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  loader: () =>
    axios.get<Array<ProjectDto>>('/projects').then((res) => res.data),
  component: ProjetsPage,
});

const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId',
  loader: ({ params }) =>
    axios
      .get<ProjectDetailedDto>(`/projects/${params.projectId}`)
      .then((res) => res.data),
  component: ProjectPage,
});

const projectDiagramRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId/diagram',
  loader: ({ params }) =>
    axios
      .get<ProjectDetailedDto>(`/projects/${params.projectId}`)
      .then((res) => res.data),
  component: ProjectDiagramPage,
});

const stepRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId/steps/$stepId',
  loader: ({ params }) =>
    axios
      .get<CategoryStepCompleteDto>(
        `/projects/${params.projectId}/steps/${params.stepId}`
      )
      .then((res) => res.data),
  component: StepPage,
});

const ursFicheRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId/urs/$id',
  loader: ({ params }) =>
    axios.get<URSDto>(`/urs/${params.id}`).then((res) => res.data),
  component: URSFichePage,
});

const databaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/database',
  loader: () =>
    axios.get<Array<ProjectDto>>('/projects').then((res) => res.data),
  component: DatabasePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  usersRoute,
  projectsRoute,
  projectRoute,
  projectDiagramRoute,
  stepRoute,
  ursFicheRoute,
  databaseRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </StrictMode>
  );
}
