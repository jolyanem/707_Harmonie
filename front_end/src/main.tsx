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
import URSListPage from '~/routes/projects/urs';
import ProjectPage from '~/routes/projects/details';

import type {
  ProjectDetailedDto,
  ProjectDto,
  URSDto,
  URSShortDto,
} from 'backend-types';

import './index.css';
import '@fontsource-variable/inter';
import StepPage from '~/routes/projects/steps/details';
import ProjectDiagramPage from '~/routes/projects/diagram';

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
  path: '/projects/$projectId/steps/$stepName',
  loader: ({ params }) =>
    axios
      .get<Array<URSShortDto>>(
        `/projects/${params.projectId}/steps/${params.stepName}`
      )
      .then((res) => res.data),
  component: StepPage,
});

const ursListeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId/urs',
  loader: ({ params }) =>
    axios
      .get<Array<URSDto>>(`/projects/${params.projectId}/urs`)
      .then((res) => res.data),
  component: URSListPage,
});

const ursFicheRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId/urs/$id',
  loader: ({ params }) =>
    axios.get<URSDto>(`/urs/${params.id}`).then((res) => res.data),
  component: URSFichePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  usersRoute,
  projectsRoute,
  projectRoute,
  projectDiagramRoute,
  stepRoute,
  ursListeRoute,
  ursFicheRoute,
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
