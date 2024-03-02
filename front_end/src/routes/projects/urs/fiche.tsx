import { useLoaderData } from '@tanstack/react-router';
import URSInfo from '~/components/URS/URSInfo';
import { AllSteps } from '~/components/URS/steps/all';

function URSFichePage() {
  const urs = useLoaderData({
    from: '/projects/$projectId/urs/$id',
  });

  return (
    <div className="grid gap-12">
      <URSInfo urs={urs} />
      <AllSteps ursId={urs.id} steps={urs.steps} />
    </div>
  );
}

export default URSFichePage;
