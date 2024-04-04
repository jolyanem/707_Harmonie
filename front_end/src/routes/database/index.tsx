import { useMutation } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import axios from 'axios';
import { ProjectPatchDto } from 'backend-types';
import {
  ProjectRow,
  defaultColumn,
  projectsColumns,
} from '~/routes/database/columns';
import { DataTable } from '~/components/database/data-table';

const DatabasePage = () => {
  const projects = useLoaderData({
    from: '/database',
  });
  const updateProjectMutation = useMutation({
    mutationKey: ['updateProject'],
    mutationFn: (project: ProjectRow) => {
      return axios.patch(`/projects/${project.id}`, {
        name: project.name,
        client: project.client,
      } satisfies ProjectPatchDto);
    },
  });

  const updateProject = (project: ProjectRow) => {
    updateProjectMutation.mutate(project);
  };

  return (
    <div className="container mx-auto">
      <DataTable
        columns={projectsColumns}
        defaultColumn={defaultColumn}
        data={projects}
        onRowUpdated={updateProject}
      />
    </div>
  );
};

export default DatabasePage;
