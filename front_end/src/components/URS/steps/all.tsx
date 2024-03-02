import type { URSDto } from 'backend-types';
import Step1_2 from '~/components/URS/steps/1_2';
import Step1_3 from '~/components/URS/steps/1_3';

export type StepProps = {
  ursId: URSDto['id'];
  step: URSDto['steps'][number];
};

type Props = {
  ursId: URSDto['id'];
  steps: URSDto['steps'];
};

export const AllSteps = ({ ursId, steps }: Props) => {
  return (
    <>
      {steps.map((step) => {
        if (step.name === '1_2') {
          return <Step1_2 key={step.name} ursId={ursId} step={step} />;
        }
        if (step.name === '1_3') {
          return <Step1_3 key={step.name} ursId={ursId} step={step} />;
        }
        return null;
      })}
    </>
  );
};
