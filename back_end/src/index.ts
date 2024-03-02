import express from 'express';
import cors from 'cors';
import { db } from './db';
import type { ProjectDto, URSDto } from './types';

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
          ],
        },
        project: {
          connect: {
            id: parseInt(req.body.projectId),
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
    const urs = await db.uRS.update({
      where: {
        id: req.params.id,
      },
      data: {
        code: req.body.code,
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
      },
      include: {
        categorySteps: true,
        steps: true,
      },
    });
    res.json(urs satisfies URSDto);
  });

app.put('/urs/:ursId/step/:stepName', async (req, res) => {
  console.log('[PUT] URS :', req.params.ursId, '> Step :', req.params.stepName);
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

app.post('/projects', async (req, res) => {
  console.log('[POST] Project :', req.body.name);
  const project = await db.project.create({
    data: {
      name: req.body.name,
      client: req.body.client,
    },
  });
  res.json(project satisfies ProjectDto);
});

app.get('/projects/:id', async (req, res) => {
  console.log('[GET] Project :', req.params.id);
  const project = await db.project.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  res.json(project satisfies ProjectDto);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
