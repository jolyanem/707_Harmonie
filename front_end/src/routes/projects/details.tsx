import { Link, useLoaderData } from '@tanstack/react-router';
import LinkToDiagram from '~/components/LinkToDiagram';
import CreateCategoryStepDialog from '~/components/categorySteps/CreateCategoryStepDialog';

const ProjectPage = () => {
  const project = useLoaderData({
    from: '/projects/$projectId',
  });
  return (
    <div>
      <header className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">{project.name}</h1>
        <LinkToDiagram projectId={project.id.toString()} />
      </header>
      <section className="mt-4">
        <h2 className="text-xl flex items-center justify-between font-medium">
          <span>Process steps level 1</span>
          <CreateCategoryStepDialog projectId={project.id} />
        </h2>
        <div className="grid grid-cols-4 bg-white rounded-lg px-4 py-2 text-[#284E91] font-semibold mt-2">
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
              TODO 
            </div> */}
          </Link>
        ))}
      </section>
    </div>
  );
};

export default ProjectPage;
