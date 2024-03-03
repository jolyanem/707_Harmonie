import type { CategoryStep, Step, URS, Project } from '@prisma/client';

export type CategoryStepDto = Pick<CategoryStep, 'id' | 'name' | 'level'>;

export type StepDto = Pick<Step, 'name' | 'status' | 'updatedAt' | 'updatedBy'>;

export type URSShortDto = Pick<URS, 'id' | 'code' | 'type' | 'name'>;

export type URSDto = Pick<
  URS,
  'id' | 'code' | 'type' | 'name' | 'description' | 'type' | 'processType'
> & {
  categorySteps: Array<CategoryStepDto>;
  steps: Array<StepDto>;
};

export type URSCreateDto = Pick<
  URS,
  'code' | 'type' | 'name' | 'description' | 'processType'
> & {
  projectId: Project['id'];
};

export type URSPutDto = Pick<
  URS,
  'code' | 'type' | 'name' | 'description' | 'processType'
> & {
  categorySteps: Array<{
    id: CategoryStep['id'];
    name: CategoryStep['name'];
    level: CategoryStep['level'];
  }>;
};

export type ProjectDto = Pick<Project, 'id' | 'name' | 'client'>;

export type ProjectDetailedDto = Pick<Project, 'id' | 'name' | 'client'> & {
  categorySteps: Record<CategoryStep['name'], Array<CategoryStep>>;
};

export type ProjectCreateDto = Pick<Project, 'name' | 'client'>;
