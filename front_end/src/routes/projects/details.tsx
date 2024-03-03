import { Link, useLoaderData } from '@tanstack/react-router';
import { Button } from '~/components/ui/button';

const ProjectPage = () => {
  const project = useLoaderData({
    from: '/projects/$projectId',
  });
  return (
    <div>
      <header className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">{project.name}</h1>
        <Button asChild>
          <Link
            to="/projects/$projectId/urs"
            params={{ projectId: project.id.toString() }}
          >
            Toutes les URS
          </Link>
        </Button>
      </header>
      <section className="mt-4">
        <div className="grid grid-cols-4 bg-white rounded-lg px-4 py-2 text-[#284E91] font-semibold">
          <div className="col-span-3">Nom</div>
          <div className="text-center">Nombre d'URS</div>
        </div>
        {Object.keys(project.categorySteps).map((stepName) => (
          <Link
            key={stepName}
            to="/projects/$projectId/steps/$stepName"
            params={{
              projectId: project.id.toString(),
              stepName: stepName,
            }}
            className="grid grid-cols-4 mt-2 px-4 py-2 bg-white rounded-lg"
          >
            <div className="col-span-3">{stepName}</div>
            <div className="text-center">
              {project.categorySteps[stepName].length}
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default ProjectPage;
