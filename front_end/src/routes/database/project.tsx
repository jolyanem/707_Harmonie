import { useLoaderData } from '@tanstack/react-router';
import {
  CategoryStepRow,
  categoryStepColumns,
  defaultColumn,
} from '~/routes/database/columns';
import { DataTable } from '~/components/database/data-table';

const DatabaseProjectDetailsPage = () => {
  const project = useLoaderData({
    from: '/database/projects/$projectId',
  });
  // const updateProjectMutation = useMutation({
  //   mutationKey: ['updateProject'],
  //   mutationFn: (project: ProjectRow) => {
  //     return axios.patch(`/projects/${project.id}`, {
  //       name: project.name,
  //       client: project.client,
  //     } satisfies ProjectPatchDto);
  //   },
  // });

  const updateCategoryStep = (project: CategoryStepRow) => {
    console.log(project);
  };

  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">{project.name}</h1>
      </header>
      <div className="container mx-auto">
        <DataTable
          columns={categoryStepColumns}
          defaultColumn={defaultColumn}
          data={project.categorySteps.map((x) => ({
            ...x,
            projectId: project.id,
          }))}
          onRowUpdated={updateCategoryStep}
        />
      </div>
    </>
  );
};

export default DatabaseProjectDetailsPage;
