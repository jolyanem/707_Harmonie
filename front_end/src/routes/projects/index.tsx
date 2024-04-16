import { Link, useLoaderData } from '@tanstack/react-router';
import CreateProjectDialog from '~/components/projects/CreateProjectDialog';

const ProjectsPage = () => {
  const projects = useLoaderData({
    from: '/projects',
  });
  return (
    <div>
      <div className="flex justify-end">
        <CreateProjectDialog />
      </div>
      <section className="mt-4">
        <div className="grid grid-cols-6 bg-white rounded-lg px-4 py-2 text-[#284E91] font-semibold">
          <div>ID</div>
          <div className="col-span-3">Titre du projet</div>
          <div className="col-span-2">Entreprise client</div>
        </div>
        {projects && Array.isArray(projects) && projects.map((project) => (
          <Link
            key={project.id}
            to="/projects/$projectId"
            params={{ projectId: project.id.toString() }}
            className="grid grid-cols-6 mt-2 px-4 py-2 bg-white rounded-lg"
          >
            <div>{project.id}</div>
            <div className="col-span-3">{project.name}</div>
            <div className="col-span-2">{project.client}</div>
            {/* <div>{project.createdAt}</div> */}
          </Link>
        ))}
      </section>
    </div>
  );
};

export default ProjectsPage;
