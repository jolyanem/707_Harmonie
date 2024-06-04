import { useMutation } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import axios from 'axios';
import { ProjectPatchDto } from 'backend-types';
import {
  CategoryStepRow,
  ProjectRow,
  URSRow,
  categoryStepColumns,
  defaultColumn,
  projectsColumns,
  ursColumns,
} from '~/routes/database/columns';
import { DataTable } from '~/components/database/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

const DatabasePage = () => {
  const { projects, steps, urs } = useLoaderData({
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

  const updateCategoryStep = (step: CategoryStepRow) => {
    console.log(step);
  };

  const updateURS = (urs: URSRow) => {
    console.log(urs);
  };

  return (
    <div className="container mx-auto mt-4">
      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="process-steps">Process Steps</TabsTrigger>
          <TabsTrigger value="urs">URS</TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <DataTable
            columns={projectsColumns}
            defaultColumn={defaultColumn}
            data={projects}
            onRowUpdated={updateProject}
            title="Table PROJECTS"
          />
        </TabsContent>
        <TabsContent value="process-steps">
          <DataTable
            columns={categoryStepColumns}
            defaultColumn={defaultColumn}
            data={steps}
            onRowUpdated={updateCategoryStep}
            title="Table PROCESS STEPS"
          />
        </TabsContent>
        <TabsContent value="urs">
          <DataTable
            columns={ursColumns}
            defaultColumn={defaultColumn}
            data={urs}
            onRowUpdated={updateURS}
            title="Table URS"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabasePage;
