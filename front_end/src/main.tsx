import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRouteWithContext,
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
  ProjectDetailDatabaseDto,
  ProjectDetailedDto,
  ProjectDto,
  URSDto,
  UserDto,
} from 'backend-types';

import './index.css';
import '@fontsource-variable/inter';
import StepPage from '~/routes/projects/steps/details';
import DatabasePage from '~/routes/database';
import DatabaseProjectDetailsPage from '~/routes/database/project';
import { AuthContext, AuthProvider, useAuth } from '~/components/auth';
import AuthCallback from '~/routes/auth/callback';
import LoginPage from '~/routes/auth/login';

const queryClient = new QueryClient();

const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.baseURL = API_URL;

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
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  beforeLoad: ({ context, location }) => {
    console.log(location.href);
    console.log(context);
    // if (!context.auth.isAuthenticated) {
    //   throw redirect({
    //     to: '/login',
    //     search: {
    //       redirect: location.href,
    //     },
    //   });
    // }
  },
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

const databaseProjectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/database/projects/$projectId',
  loader: ({ params }) =>
    axios
      .get<ProjectDetailDatabaseDto>(`/database/projects/${params.projectId}`)
      .then((res) => res.data),
  component: DatabaseProjectDetailsPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const authCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/callback',
  component: AuthCallback,
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
  databaseProjectDetailRoute,
  authCallbackRoute,
  loginRoute,
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
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ auth }} />
      <Toaster />
    </QueryClientProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
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
