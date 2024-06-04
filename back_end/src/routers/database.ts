import express from 'express';
import { db } from '../db.js';
import type {
  CategoryStepDatabaseDto,
  CategoryStepDto,
  ProjectDto,
  URSDatabaseDto,
} from '../types.js';
import type { Project } from '@prisma/client';

const databaseRouter = express.Router();

databaseRouter
  .get('/projects', async (_req, res) => {
    const projects = await db.project.findMany();
    return res.json(projects satisfies Array<ProjectDto>);
  })
  .get('/steps', async (_req, res) => {
    const steps = await db.categoryStep.findMany({
      include: {
        parent: true,
        project: true,
        _count: {
          select: {
            URS: true,
            children: true,
          },
        },
      },
    });
    return res.json(
      steps.map((step) => ({
        ...step,
        projectName: step.project.name,
        projectId: step.project.id,
        URSCount: step._count.URS,
        childrenCount: step._count.children,
        parentName: step.parent?.name,
      })) satisfies Array<CategoryStepDatabaseDto>
    );
  })
  .get('/urs', async (_req, res) => {
    const urs = await db.uRS.findMany({
      include: {
        categoryStep: {
          include: {
            project: true,
          },
        },
      },
    });
    return res.json(
      urs.map((u) => ({
        ...u,
        categoryStepName: u.categoryStep.name,
        projectName: u.categoryStep.project.name,
      })) satisfies Array<URSDatabaseDto>
    );
  });

export { databaseRouter };
