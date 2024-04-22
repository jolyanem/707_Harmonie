import { useLoaderData } from '@tanstack/react-router';
import URSInfo from '~/components/URS/URSInfo';
import { AllSteps } from '~/components/URS/steps/all';
import AllStepsStatus from '~/components/URS/steps/all-status';

function URSFichePage() {
  const urs = useLoaderData({
    from: '/projects/$projectId/urs/$id',
  });

  return (
    <div className="grid gap-6">
      <URSInfo urs={urs} />
      <AllStepsStatus ursId={urs.id} steps={urs.steps} />
      <AllSteps ursId={urs.id} steps={urs.steps} />
    </div>
  );
}

export default URSFichePage;
