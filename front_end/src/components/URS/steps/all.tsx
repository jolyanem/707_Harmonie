import { useState } from 'react';
import type { URSDto } from 'backend-types';
import Step1_2 from '~/components/URS/steps/1_2';
import Step1_3 from '~/components/URS/steps/1_3';
import { Button } from '~/components/ui/button';
import { Edit2Icon } from 'lucide-react';
import { useLoaderData } from '@tanstack/react-router';
import Step4_4 from '~/components/URS/steps/4_4';
import Step8_4 from '~/components/URS/steps/8_4';
import Step6_7 from '~/components/URS/steps/6_7';
import Step3_1 from '~/components/URS/steps/3_1';
import Step3_2 from '~/components/URS/steps/3_2';
import Step6_5 from '~/components/URS/steps/6_5';
import Step7_1 from '~/components/URS/steps/7_1';
import Step7_2 from '~/components/URS/steps/7_2';
import Step9_4 from '~/components/URS/steps/9_4';
import Step8_2 from '~/components/URS/steps/8_2';

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
          case '3_1':
            return (
              <Step3_1
                ursId={ursId}
                step={step}
                readonly={readonly}
                setReadonly={setReadonly}
              />
            );
          case '3_2':
            return (
              <Step3_2
                ursId={ursId}
                step={step}
                readonly={readonly}
                setReadonly={setReadonly}
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
          case '6_5':
            return (
              <Step6_5
                ursId={ursId}
                step={step}
                readonly={readonly}
                setReadonly={setReadonly}
              />
            );
          case '6_7':
            return (
              <Step6_7
                ursId={ursId}
                step={step}
                readonly={readonly}
                setReadonly={setReadonly}
                risks={urs.risks}
              />
            );
          case '7_1':
            return (
              <Step7_1
                ursId={ursId}
                step={step}
                readonly={readonly}
                setReadonly={setReadonly}
              />
            );
          case '7_2':
            return (
              <Step7_2
                ursId={ursId}
                step={step}
                readonly={readonly}
                setReadonly={setReadonly}
              />
            );
          case '8_2':
            return (
              <Step8_2
                ursId={ursId}
                step={step}
                readonly={readonly}
                setReadonly={setReadonly}
                risks={urs.risks}
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
          case '9_4':
            return (
              <Step9_4
                ursId={ursId}
                step={step}
                readonly={readonly}
                setReadonly={setReadonly}
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
