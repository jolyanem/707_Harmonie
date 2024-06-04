import express from 'express';
import { db } from '../db.js';
import type {
  ProjectDetailedDto,
  ProjectDto,
  ProjectPatchDto,
} from '../types.js';

const projectsRouter = express.Router();

projectsRouter
  .get('/', async (req, res) => {
    console.log('[GET] Projects');
    if (res.locals.user?.role !== 'Collaborateur') {
      const user = await db.user.findUnique({
        where: {
          id: res.locals.user?.id,
        },
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const projects = await db.project.findMany({
        where: {
          client: user.employerName,
        },
      });
      return res.json(projects satisfies Array<ProjectDto>);
    }
    const projects = await db.project.findMany();
    return res.json(projects satisfies Array<ProjectDto>);
  })
  .post('/', async (req, res) => {
    if (res.locals.user?.role !== 'Collaborateur') {
      return res.status(403).json({
        message: '',
      });
    }
    console.log('[POST] Project :', req.body.name);
    const project = await db.project.create({
      data: {
        name: req.body.name,
        client: req.body.client,
        objective: req.body.objective,
        clientProjectLead: req.body.clientProjectLead,
        clientQualityRepresentative: req.body.clientQualityRepresentative,
        leadAMOA: req.body.leadAMOA,
        leadValidation: req.body.leadValidation,
        providersMacro: req.body.providersMacro,
        providersDetailed: req.body.providersDetailed,
        applicableRegulations: req.body.applicableRegulations,
      },
    });
    res.json(project satisfies ProjectDto);
  })
  .patch('/:id', async (req, res) => {
    if (res.locals.user?.role !== 'Collaborateur') {
      return res.status(403).json({
        message: '',
      });
    }
    console.log('[PATCH] Project :', req.params.id);
    const body = req.body as ProjectPatchDto;
    const project = await db.project.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        name: body.name,
        client: body.client,
        objective: req.body.objective,
        clientProjectLead: req.body.clientProjectLead,
        clientQualityRepresentative: req.body.clientQualityRepresentative,
        leadAMOA: req.body.leadAMOA,
        leadValidation: req.body.leadValidation,
        providersMacro: req.body.providersMacro,
        providersDetailed: req.body.providersDetailed,
      },
    });
    res.json(project satisfies ProjectDto);
  })
  .get('/:id', async (req, res) => {
    console.log('[GET] Project :', req.params.id);
    const project = await db.project.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const categorySteps = await db.categoryStep.findMany({
      include: {
        URS: true,
        children: {
          include: {
            URS: true,
            children: {
              include: {
                URS: true,
                children: {
                  include: {
                    URS: true,
                    children: {
                      include: {
                        URS: true,
                        children: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        projectId: project.id,
        parentId: null,
      },
    });
    res.json({
      ...project,
      categorySteps,
    } satisfies ProjectDetailedDto);
  });

export { projectsRouter };
