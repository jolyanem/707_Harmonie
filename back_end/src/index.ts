import express from 'express';
import cors from 'cors';
import { db } from './db';
import type {
  ProjectDetailedDto,
  ProjectDto,
  URSDto,
  URSPutDto,
  URSShortDto,
} from './types';
import { CategoryStep } from '@prisma/client';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app
  .get('/urs/:id', async (req, res) => {
    console.log('[GET] URS :', req.params.id);
    const id = req.params.id;
    const urs = await db.uRS.findUnique({
      where: {
        id,
      },
      include: {
        categorySteps: true,
        steps: true,
      },
    });
    if (!urs) {
      return res.status(404).json({ message: 'URS not found' });
    }
    res.json(urs satisfies URSDto);
  })
  .post('/urs', async (req, res) => {
    console.log('[POST] URS :', req.body.id);
    const urs = await db.uRS.create({
      data: {
        code: req.body.code,
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        processType: req.body.processType,
        criticalityClient: 'N',
        criticalityVSI: 'N',
        steps: {
          create: [
            {
              name: '1_2',
              status: 'todo',
            },
            {
              name: '1_3',
              status: 'todo',
            },
            {
              name: '3_1',
              status: 'todo',
            },
            {
              name: '3_2',
              status: 'todo',
            },
            {
              name: '4_4',
              status: 'todo',
            },
            {
              name: '6_5',
              status: 'todo',
            },
            {
              name: '6_7',
              status: 'todo',
            },
            {
              name: '7_1',
              status: 'todo',
            },
            {
              name: '7_2',
              status: 'todo',
            },
            {
              name: '8_2',
              status: 'todo',
            },
            {
              name: '8_4',
              status: 'todo',
            },
            {
              name: '9_4',
              status: 'todo',
            },
          ],
        },
        project: {
          connect: {
            id: req.body.projectId,
          },
        },
      },
      include: {
        categorySteps: true,
        steps: true,
      },
    });
    res.json(urs satisfies URSDto);
  })
  .put('/urs/:id', async (req, res) => {
    console.log('[PUT] URS :', req.params.id);
    const body = req.body as URSPutDto;
    const urs = await db.uRS.update({
      where: {
        id: req.params.id,
      },
      data: {
        code: body.code,
        name: body.name,
        description: body.description,
        type: body.type,
        processType: body.processType,
      },
      include: {
        categorySteps: true,
        steps: true,
      },
    });
    const oldSteps = await db.categoryStep.findMany({
      where: {
        URSId: urs.id,
      },
    });
    const stepsToDelete = oldSteps.filter(
      (oldStep) => !body.categorySteps.some((step) => step.id === oldStep.id)
    );
    for (const step of stepsToDelete) {
      await db.categoryStep.delete({
        where: {
          id: step.id,
        },
      });
    }
    for (const step of body.categorySteps) {
      await db.categoryStep.upsert({
        where: {
          id: step.id,
        },
        update: {
          name: step.name,
          level: step.level,
        },
        create: {
          id: step.id,
          name: step.name,
          level: step.level,
          URS: {
            connect: {
              id: urs.id,
            },
          },
        },
      });
    }
    res.json(urs satisfies URSDto);
  })
  .put('/urs/:ursId/step/:stepName', async (req, res) => {
    console.log(
      '[PUT] URS :',
      req.params.ursId,
      '> Step :',
      req.params.stepName
    );
    const ursId = req.params.ursId;
    const stepName = req.params.stepName;
    const step = await db.step.update({
      where: {
        URSId_name: {
          URSId: ursId,
          name: stepName,
        },
      },
      data: {
        status: req.body.status,
        updatedAt: new Date(),
        updatedBy: '',
      },
    });
    res.json(step);
  });

app.get('/projects', async (req, res) => {
  console.log('[GET] Projects');
  const projects = await db.project.findMany();
  res.json(projects satisfies Array<ProjectDto>);
});

app
  .post('/projects', async (req, res) => {
    console.log('[POST] Project :', req.body.name);
    const project = await db.project.create({
      data: {
        name: req.body.name,
        client: req.body.client,
      },
    });
    res.json(project satisfies ProjectDto);
  })
  .get('/projects/:id', async (req, res) => {
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
      where: {
        URS: {
          projectId: project.id,
        },
      },
    });
    const categoryStepsMap = categorySteps.reduce((acc, categoryStep) => {
      if (!acc[categoryStep.name]) {
        acc[categoryStep.name] = [];
      }
      acc[categoryStep.name]!.push(categoryStep);
      return acc;
    }, {} as Record<CategoryStep['name'], Array<CategoryStep>>);
    res.json({
      ...project,
      categorySteps: categoryStepsMap,
    } satisfies ProjectDetailedDto);
  })
  .get('/projects/:projectId/urs', async (req, res) => {
    console.log('[GET] Project :', req.params.projectId, '> URS');
    const projectId = req.params.projectId;
    const urs = await db.uRS.findMany({
      where: {
        projectId: parseInt(projectId),
      },
      include: {
        categorySteps: true,
        steps: true,
      },
    });
    res.json(urs satisfies Array<URSDto>);
  })
  .get('/projects/:projectId/steps/:stepName', async (req, res) => {
    console.log(
      '[GET] Project :',
      req.params.projectId,
      '> Step :',
      req.params.stepName
    );
    const projectId = req.params.projectId;
    const stepName = req.params.stepName;
    const urs = await db.uRS.findMany({
      where: {
        categorySteps: {
          some: {
            name: {
              equals: stepName,
            },
          },
        },
        projectId: parseInt(projectId),
      },
    });
    res.json(urs satisfies Array<URSShortDto>);
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
