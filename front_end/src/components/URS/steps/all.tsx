import { useState } from 'react';
import type { StepDto, URSDto } from 'backend-types';
import Step1_3 from '~/components/URS/steps/1_3';
import { Button } from '~/components/ui/button';
import { Edit2Icon } from 'lucide-react';
import { useLoaderData } from '@tanstack/react-router';
import Step4_4 from '~/components/URS/steps/4_4';
import Step8_4 from '~/components/URS/steps/8_4';
import Step6_7 from '~/components/URS/steps/6_7';
import Step3_1 from '~/components/URS/steps/3_1';
import Step8_2 from '~/components/URS/steps/8_2';

export const STEP_NAMES = {
  '1_3': 'Étude criticité',
  '3_1': 'Récupération des processus opérationnels',
  '3_2': 'Production des urs détaillées',
  '4_4': 'Réponses fournisseurs point par point avec preuve',
  '6_5': 'Spec. tech et fonctionnelles (intégrateur / fournisseur)',
  '6_7': 'Analyse de risques',
  '7_1': 'Tests intégration (AMOCIS) / Pré-recette',
  '7_2': 'Tests utilisateurs (AMOCIS / client) / Recettes',
  '8_2': 'Tests qualifiants basés sur l’analyse de risque',
  '8_4': 'Vérifications Opérationnelles (VO)',
  '9_4': 'Matrice de traçabilité',
} as const;

export type StepProps = {
  ursId: URSDto['id'];
  step: URSDto['steps'][number];
  readonly?: boolean;
  setReadonly: (readonly: boolean) => void;
};

const StepWrapper = ({ ursId, step }: StepProps) => {
  const { urs, project } = useLoaderData({
    from: '/projects/$projectId/urs/$id',
  });
  const [readonly, setReadonly] = useState(true);

  return (
    <article className="relative">
      <h2 className="font-semibold text-lg uppercase">
        <span className="text-slate-400">|</span>{' '}
        {STEP_NAMES[step.name as keyof typeof STEP_NAMES] ?? step.name}
      </h2>
      <div>
        {(() => {
          switch (step.name) {
            case '1_3':
              return (
                <Step1_3
                  ursId={ursId}
                  step={step}
                  readonly={readonly}
                  setReadonly={setReadonly}
                  criticalityClient={urs.criticalityClient}
                  businessObligation={urs.businessObligation}
                  regulatoryObligation={urs.regulatoryObligation}
                />
              );
            case '3_1':
              return (
                <Step3_1
                  ursId={ursId}
                  step={step}
                  readonly={readonly}
                  setReadonly={setReadonly}
                  operationalProcessLinks={urs.operationalProcessLinks}
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
                  ursTypeNeed={urs.typeNeed}
                  projectMacroSuppliers={project.providersMacro}
                  projectDetailedSuppliers={project.providersDetailed}
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
            default:
              break;
          }
        })()}
      </div>
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

const STATUS_ONLY_STEPS: StepDto['name'][] = [
  '3_2',
  '6_5',
  '7_1',
  '7_2',
  '9_4',
];

type Props = {
  ursId: URSDto['id'];
  steps: URSDto['steps'];
};

export const AllSteps = ({ ursId, steps }: Props) => {
  return (
    <>
      {steps
        .filter((step) => !STATUS_ONLY_STEPS.includes(step.name))
        .map((step) => (
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
