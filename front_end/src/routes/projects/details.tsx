import { Link, useLoaderData } from '@tanstack/react-router';
import CreateCategoryStepDialog from '~/components/categorySteps/CreateCategoryStepDialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '~/components/ui/breadcrumb';

const ProjectPage = () => {
  const project = useLoaderData({
    from: '/projects/$projectId',
  });
  return (
    <div>
      {/* <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{project.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}
      <header className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">{project.name}</h1>
        <CreateCategoryStepDialog projectId={project.id} />
      </header>
      <section className="mt-4">
        <div className="grid grid-cols-4 bg-white rounded-lg px-4 py-2 text-[#284E91] font-semibold">
          <div className="col-span-3">Nom</div>
          {/* <div className="text-center">Nombre d'URS</div> */}
        </div>
        {project.categorySteps.map((categoryStep) => (
          <Link
            key={categoryStep.id}
            to="/projects/$projectId/steps/$stepId"
            params={{
              projectId: project.id.toString(),
              stepId: categoryStep.id,
            }}
            className="grid grid-cols-4 mt-2 px-4 py-2 bg-white rounded-lg"
          >
            <div className="col-span-3">{categoryStep.name}</div>
            {/* <div className="text-center">
              {project.categorySteps.find((step) => step.id === stepId)?.}
            </div> */}
          </Link>
        ))}
      </section>
    </div>
  );
};

export default ProjectPage;
