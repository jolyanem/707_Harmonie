import express from 'express';
import { db } from '../db';
import { ProjectDetailedDto, ProjectDto, ProjectPatchDto } from '../types';

const projectsRouter = express.Router();

projectsRouter
  .get('/', async (req, res) => {
    console.log('[GET] Projects');
    const projects = await db.project.findMany();
    res.json(projects satisfies Array<ProjectDto>);
  })
  .post('/', async (req, res) => {
    console.log('[POST] Project :', req.body.name);
    const project = await db.project.create({
      data: {
        name: req.body.name,
        client: req.body.client,
      },
    });
    res.json(project satisfies ProjectDto);
  })
  .patch('/:id', async (req, res) => {
    console.log('[PATCH] Project :', req.params.id);
    const body = req.body as ProjectPatchDto;
    const project = await db.project.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        name: body.name,
        client: body.client,
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
