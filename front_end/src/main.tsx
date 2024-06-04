import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRouteWithContext,
  redirect,
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
  CategoryStepDatabaseDto,
  CategoryStepDto,
  ProjectDetailDatabaseDto,
  ProjectDetailedDto,
  ProjectDto,
  URSDatabaseDto,
  URSDto,
  UserDto,
} from 'backend-types';

import './index.css';
import '@fontsource-variable/inter';
import StepPage from '~/routes/projects/steps/details';
import DatabasePage from '~/routes/database';
import { AuthContext, AuthProvider, useAuth } from '~/components/auth';
import LoginPage from '~/routes/auth/login';
import CallbackPage from '~/routes/auth/callback';

const queryClient = new QueryClient();

const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

const catchError = (error: Error) => {
  if (
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'status' in error.response &&
    (error.response?.status === 403 || error.response?.status === 401)
  ) {
    throw redirect({
      to: '/',
    });
  }
};

interface RouterContext {
  auth: AuthContext;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
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
  loader: () => axios.get<Array<UserDto>>('/users').then((res) => res.data),
  component: UsersPage,
  onError: catchError,
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  loader: () =>
    axios.get<Array<ProjectDto>>('/projects').then((res) => res.data),
  component: ProjetsPage,
  // onError: catchError,
});

const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId',
  loader: ({ params }) =>
    axios
      .get<ProjectDetailedDto>(`/projects/${params.projectId}`)
      .then((res) => res.data),
  component: ProjectPage,
  onError: catchError,
});

const projectDiagramRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId/diagram',
  loader: ({ params }) =>
    axios
      .get<ProjectDetailedDto>(`/projects/${params.projectId}`)
      .then((res) => res.data),
  onError: catchError,
}).lazy(() =>
  import('~/routes/projects/diagram').then((d) => d.ProjectDiagramPageRoute)
);

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
  onError: catchError,
});

const ursFicheRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId/urs/$id',
  loader: async ({ params }) => {
    const res = await Promise.all([
      axios
        .get<ProjectDto>(`/projects/${params.projectId}`)
        .then((res) => res.data),
      axios.get<URSDto>(`/urs/${params.id}`).then((res) => res.data),
    ]);
    return {
      project: res[0],
      urs: res[1],
    };
  },
  component: URSFichePage,
  onError: catchError,
});

const databaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/database',
  loader: async () => {
    const res = await Promise.all([
      axios
        .get<Array<ProjectDto>>('/database/projects')
        .then((res) => res.data),
      axios
        .get<Array<CategoryStepDatabaseDto>>('/database/steps')
        .then((res) => res.data),
      axios.get<Array<URSDatabaseDto>>('/database/urs').then((res) => res.data),
    ]);
    return {
      projects: res[0],
      steps: res[1],
      urs: res[2],
    };
  },
  component: DatabasePage,
  onError: catchError,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/login',
  component: LoginPage,
});

const authCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/callback',
  component: CallbackPage,
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
  loginRoute,
  authCallbackRoute,
]);

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  return (
    <>
      <RouterProvider router={router} context={{ auth }} />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </QueryClientProvider>
  );
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
