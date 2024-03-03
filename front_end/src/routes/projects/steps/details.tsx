import { Link, useLoaderData, useParams } from '@tanstack/react-router';

const StepPage = () => {
  const { projectId, stepName } = useParams({
    from: '/projects/$projectId/steps/$stepName',
  });
  const urs = useLoaderData({
    from: '/projects/$projectId/steps/$stepName',
  });
  return (
    <>
      <h1 className="font-bold text-2xl">{stepName}</h1>
      <section className="mt-4">
        <div className="grid grid-cols-5 bg-white rounded-lg px-4 py-2 text-[#284E91] font-semibold">
          <div>Code</div>
          <div className="col-span-3">Nom</div>
          <div>Statut</div>
        </div>
        {urs.map((u) => (
          <Link
            key={u.id}
            to="/projects/$projectId/urs/$id"
            params={{
              projectId: projectId,
              id: u.id.toString(),
            }}
            className="grid grid-cols-5 mt-2 px-4 py-2 bg-white rounded-lg"
          >
            <div>{u.code}</div>
            <div className="col-span-3">{u.name}</div>
            <div>{/*TODO URS Status */}</div>
          </Link>
        ))}
      </section>
    </>
  );
};

export default StepPage;
