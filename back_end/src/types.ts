import type {
  CategoryStep,
  Step,
  URS,
  Project,
  SupplierResponse,
  AuditTrail,
  Risk,
  Cause,
  ActionPlan,
  Test,
} from '@prisma/client';

export type CategoryStepDto = Pick<CategoryStep, 'id' | 'name'> & {
  parent?: CategoryStepDto | null;
};

export type CategoryStepCreateDto = Pick<CategoryStep, 'name' | 'projectId'> & {
  parentId?: CategoryStep['id'];
};

export type CategoryStepCompleteDto = CategoryStep & {
  children: Array<CategoryStepDto>;
  URS: Array<URSShortDto>;
  parents: Array<CategoryStepDto>;
};

export type StepDto = Pick<Step, 'name' | 'status' | 'updatedAt' | 'updatedBy'>;

export type SupplierResponsesDto = Pick<
  SupplierResponse,
  | 'answer'
  | 'customApprouved'
  | 'customCost'
  | 'customTmpsDev'
  | 'id'
  | 'name'
  | 'statut'
  | 'type'
>;

export type AuditTrailDto = Pick<
  AuditTrail,
  'id' | 'revue' | 'revueComment' | 'consultationComment' | 'consultation'
>;

export type CauseDto = Pick<Cause, 'id' | 'probability' | 'type'>;
export type TestDto = Pick<Test, 'id' | 'name' | 'documentation' | 'comments'>;

export type ActionPlanDto = Pick<
  ActionPlan,
  'id' | 'qp' | 'datamigration' | 'revueConfig' | 'documentation' | 'qiqo'
>;

export type RiskDto = Pick<
  Risk,
  | 'id'
  | 'impact'
  | 'comment'
  | 'consequence'
  | 'deficiencyDescription'
  | 'riskClass'
  | 'riskResidueLevel'
> & {
  causes: Array<CauseDto>;
  actionPlan: ActionPlanDto;
  tests: Array<TestDto>;
};

export type URSShortDto = Pick<URS, 'id' | 'code' | 'type' | 'name'>;

export type URSDto = Pick<
  URS,
  | 'id'
  | 'code'
  | 'type'
  | 'name'
  | 'description'
  | 'type'
  | 'processType'
  | 'criticalityClient'
  | 'criticalityVSI'
> & {
  categorySteps: CategoryStepDto[];
  steps: Array<StepDto>;
  supplierResponses: Array<SupplierResponsesDto>;
  auditTrail: AuditTrailDto;
  risks: Array<RiskDto>;
};

export type URSCreateDto = Pick<
  URS,
  'code' | 'type' | 'name' | 'description' | 'processType'
> & {
  categoryStepId: CategoryStep['id'];
};

export type URSPutDto = Pick<
  URS,
  'code' | 'type' | 'name' | 'description' | 'processType'
> & {
  categorySteps: Array<{
    id: CategoryStep['id'];
    name: CategoryStep['name'];
  }>;
};

export type ProjectDto = Pick<Project, 'id' | 'name' | 'client' | 'createdAt'>;

export type ProjectDetailedDto = Pick<Project, 'id' | 'name' | 'client'> & {
  categorySteps: Array<
    CategoryStep & {
      URS: Array<URSShortDto>;
      children: Array<
        CategoryStep & {
          URS: Array<URSShortDto>;
          children: Array<
            CategoryStep & {
              URS: Array<URSShortDto>;
              children: Array<
                CategoryStep & {
                  URS: Array<URSShortDto>;
                  children: Array<
                    CategoryStep & {
                      URS: Array<URSShortDto>;
                      children: Array<CategoryStepDto>;
                    }
                  >;
                }
              >;
            }
          >;
        }
      >;
    }
  >;
};

export type ProjectCreateDto = Pick<Project, 'name' | 'client'>;
