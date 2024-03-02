import type { CategoryStep, Step, URS, Project } from '@prisma/client';

export type CategoryStepDto = Pick<CategoryStep, 'id' | 'name' | 'level'>;

export type StepDto = Pick<Step, 'name' | 'status' | 'updatedAt' | 'updatedBy'>;

export type URSDto = Pick<
  URS,
  'id' | 'code' | 'type' | 'name' | 'description' | 'type'
> & {
  categorySteps: Array<CategoryStepDto>;
  steps: Array<StepDto>;
};

export type URSCreateDto = Pick<
  URS,
  'code' | 'type' | 'name' | 'description'
> & {
  projectId: Project['id'];
};

export type ProjectDto = Pick<Project, 'id' | 'name' | 'client'>;

export type ProjectCreateDto = Pick<Project, 'name' | 'client'>;
