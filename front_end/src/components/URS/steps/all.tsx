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
        switch (step.name) {
          case '1_2':
            return <Step1_2 key={step.name} ursId={ursId} step={step} />;
          case '1_3':
            return <Step1_3 key={step.name} ursId={ursId} step={step} />;
          // case '3_1':
          //   return <Step3_1 key={step.name} ursId={ursId} step={step} />;
          default:
            break;
        }
        return null;
      })}
    </>
  );
};
