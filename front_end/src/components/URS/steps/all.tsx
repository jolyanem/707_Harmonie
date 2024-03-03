import { useState } from 'react';
import type { URSDto } from 'backend-types';
import Step1_2 from '~/components/URS/steps/1_2';
import Step1_3 from '~/components/URS/steps/1_3';
import { Button } from '~/components/ui/button';
import { Edit2Icon } from 'lucide-react';
import { useLoaderData } from '@tanstack/react-router';
import Step4_4 from '~/components/URS/steps/4_4';
import Step8_4 from '~/components/URS/steps/8_4';

export type StepProps = {
  ursId: URSDto['id'];
  step: URSDto['steps'][number];
  readonly?: boolean;
  setReadonly: (readonly: boolean) => void;
};

const StepWrapper = ({ ursId, step }: StepProps) => {
  const urs = useLoaderData({
    from: '/projects/$projectId/urs/$id',
  });
  const [readonly, setReadonly] = useState(true);

  return (
    <article className="relative">
      {(() => {
        switch (step.name) {
          case '1_2':
            return (
              <Step1_2
                ursId={ursId}
                step={step}
                readonly={readonly}
                setReadonly={setReadonly}
              />
            );
          case '1_3':
            return (
              <Step1_3
                ursId={ursId}
                step={step}
                readonly={readonly}
                setReadonly={setReadonly}
                criticalityClient={urs.criticalityClient}
                criticalityVSI={urs.criticalityVSI}
              />
            );
          case '4_4':
            return (
              <Step4_4
                ursId={ursId}
                step={step}
                readonly={readonly}
                setReadonly={setReadonly}
                supplierResponses={urs.supplierResponses}
              />
            );
          case '8_4':
            return (
              <Step8_4
                ursId={ursId}
                step={step}
                readonly={readonly}
                setReadonly={setReadonly}
                auditTrail={urs.auditTrail}
              />
            );
          default:
            break;
        }
      })()}
      {readonly && (
        <Button
          size="icon"
          className="p-O h-6 w-6 rounded-md absolute top-11 right-1.5 bg-slate-700 hover:bg-slate-900"
          onClick={() => setReadonly(!readonly)}
        >
          <Edit2Icon size="12" />
        </Button>
      )}
    </article>
  );
};

type Props = {
  ursId: URSDto['id'];
  steps: URSDto['steps'];
};

export const AllSteps = ({ ursId, steps }: Props) => {
  return (
    <>
      {steps.map((step) => (
        <StepWrapper
          key={step.name}
          ursId={ursId}
          step={step}
          setReadonly={() => {}}
        />
      ))}
    </>
  );
};
