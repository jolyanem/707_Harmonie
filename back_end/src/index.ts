import express from 'express';
import cors from 'cors';
import { db } from './db.js';
import type {
  CategoryStepCompleteDto,
  CategoryStepDto,
  OperationalProcessLinkDto,
  ProjectDetailDatabaseDto,
  RiskDto,
  SupplierResponsesDto,
  URSCreateDto,
  URSDto,
  URSPutDto,
  URSShortDto,
  UserDto,
} from './types.js';
import type { CategoryStep, Session } from '@prisma/client';
import { authRouter } from './routers/auth.js';
import { usersRouter } from './routers/users.js';
import { projectsRouter } from './routers/projects.js';
import type { User } from 'lucia';
import {
  isAuthenticatedMiddleware,
  loggerMiddleware,
  originMiddleware,
  sessionMiddleware,
} from './middlewares.js';
import { databaseRouter } from './routers/database.js';

const app = express();
const port = 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiRouter = express.Router();
apiRouter.use(loggerMiddleware);
apiRouter.use(originMiddleware);
apiRouter.use(sessionMiddleware);

declare global {
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}

apiRouter.get('/health', (_req, res) => res.json({ status: 'healthy' }));

apiRouter.use('/auth', authRouter);

apiRouter.use(isAuthenticatedMiddleware);

const getURSCodeNumber = async (categoryStepId: string, type: string) => {
  const urs = await db.uRS.findMany({
    where: {
      categoryStepId,
    },
  });
  if (!urs) {
    return '001';
  }
  const codeNumber = urs.filter((urs) => urs.type === type).length + 1;
  return ('00' + codeNumber).slice(-3);
};

apiRouter
  .get('/urs/:id', async (req, res) => {
    const id = req.params.id;
    const urs = await db.uRS.findUnique({
      where: {
        id,
      },
      include: {
        categoryStep: {
          include: {
            parent: true,
          },
        },
        operationalProcessLinks: true,
        steps: {
          orderBy: {
            name: 'asc',
          },
        },
        supplierResponses: true,
        auditTrail: true,
        risks: {
          include: {
            causes: true,
            actionPlan: true,
            tests: true,
          },
        },
      },
    });
    if (!urs) {
      return res.status(404).json({ message: 'URS not found' });
    }
    const categorySteps = await getCategoryStepParents(urs.categoryStep);
    res.json({ ...urs, categorySteps } satisfies URSDto);
  })
  .put('/urs/:id/step/:stepName/status', async (req, res) => {
    if (res.locals.user?.role !== 'Collaborateur') {
      return res.status(403).json({
        message: '',
      });
    }
    const ursId = req.params.id;
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
  })
  .post('/urs', async (req, res) => {
    if (res.locals.user?.role !== 'Collaborateur') {
      return res.status(403).json({
        message: '',
      });
    }
    const body = req.body as URSCreateDto;
    const urs = await db.uRS.create({
      data: {
        code:
          body.type + (await getURSCodeNumber(body.categoryStepId, body.type)),
        name: body.name,
        type: body.type,
        typeNeed: body.typeNeed,
        description: body.description,
        processType: body.processType,
        criticalityClient: 'na',
        regulatoryObligation: 'na',
        businessObligation: 'na',
        steps: {
          create: [
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
        categoryStep: {
          connect: {
            id: body.categoryStepId,
          },
        },
        auditTrail: {
          create: {
            revue: false,
            revueComment: '',
            consultation: false,
            consultationComment: '',
          },
        },
      },
    });
    res.json(urs satisfies URSShortDto);
  })
  .put('/urs/:id', async (req, res) => {
    if (res.locals.user?.role !== 'Collaborateur') {
      return res.status(403).json({
        message: '',
      });
    }
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
        typeNeed: body.typeNeed,
        processType: body.processType,
      },
    });
    res.json(urs satisfies URSShortDto);
  })
  .put('/urs/:ursId/step/:stepName', async (req, res) => {
    if (res.locals.user?.role !== 'Collaborateur') {
      return res.status(403).json({
        message: '',
      });
    }

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
    if (step.name === '1_3') {
      await db.uRS.update({
        where: {
          id: ursId,
        },
        data: {
          criticalityClient: req.body.criticalityClient,
          businessObligation: req.body.businessObligation,
          regulatoryObligation: req.body.regulatoryObligation,
        },
      });
    }
    if (step.name === '3_1') {
      const newOperationalProcessLinks = req.body
        .operationalProcessLinks as Array<OperationalProcessLinkDto>;
      const oldOperationalProcessLinks = await db.link.findMany({
        where: {
          URSId: ursId,
        },
      });
      const operationalProcessLinksToDelete = oldOperationalProcessLinks.filter(
        (oldOperationalProcessLink) =>
          !newOperationalProcessLinks.some(
            (operationalProcessLink) =>
              operationalProcessLink.id === oldOperationalProcessLink.id
          )
      );
      for (const operationalProcessLink of operationalProcessLinksToDelete) {
        await db.link.delete({
          where: {
            id: operationalProcessLink.id,
          },
        });
      }
      for (const operationalProcessLink of newOperationalProcessLinks) {
        await db.link.upsert({
          where: {
            id: operationalProcessLink.id,
          },
          update: {
            name: operationalProcessLink.name,
            link: operationalProcessLink.link,
          },
          create: {
            id: operationalProcessLink.id,
            name: operationalProcessLink.name,
            link: operationalProcessLink.link,
            URSId: ursId,
          },
        });
      }
    }
    if (step.name === '4_4') {
      const newSupplierResponses = req.body
        .supplierResponses as Array<SupplierResponsesDto>;
      const oldSupplierResponses = await db.supplierResponse.findMany({
        where: {
          URSId: ursId,
        },
      });
      const supplierResponsesToDelete = oldSupplierResponses.filter(
        (oldSupplierResponse) =>
          !newSupplierResponses.some(
            (supplierResponse) => supplierResponse.id === oldSupplierResponse.id
          )
      );
      for (const supplierResponse of supplierResponsesToDelete) {
        await db.supplierResponse.delete({
          where: {
            id: supplierResponse.id,
          },
        });
      }
      for (const supplierResponse of newSupplierResponses) {
        const isCustomType = supplierResponse.type === 'custom';
        await db.supplierResponse.upsert({
          where: {
            id: supplierResponse.id,
          },
          update: {
            answer: supplierResponse.answer,
            name: supplierResponse.name,
            statut: supplierResponse.statut,
            type: supplierResponse.type,
            customApprouved: isCustomType
              ? supplierResponse.customApprouved
              : false,
            customCost: isCustomType ? supplierResponse.customCost : 0,
            customTmpsDev: isCustomType ? supplierResponse.customTmpsDev : 0,
          },
          create: {
            id: supplierResponse.id,
            answer: supplierResponse.answer,
            name: supplierResponse.name,
            statut: supplierResponse.statut,
            type: supplierResponse.type,
            URSId: ursId,
            customApprouved: isCustomType
              ? supplierResponse.customApprouved
              : false,
            customCost: isCustomType ? supplierResponse.customCost : 0,
            customTmpsDev: isCustomType ? supplierResponse.customTmpsDev : 0,
          },
        });
      }
    }
    if (step.name === '6_7') {
      const newRisks = req.body.risks as Array<RiskDto>;
      const oldRisks = await db.risk.findMany({
        where: {
          URSId: ursId,
        },
      });
      const risksToDelete = oldRisks.filter(
        (oldRisk) => !newRisks.some((risk) => risk.id === oldRisk.id)
      );
      for (const risk of risksToDelete) {
        await db.risk.delete({
          where: {
            id: risk.id,
          },
        });
      }
      for (const risk of newRisks) {
        const oldCauses = await db.cause.findMany({
          where: {
            riskId: risk.id,
          },
        });
        const newCauses = risk.causes.filter(
          (cause) => !oldCauses.some((oldCause) => oldCause.id === cause.id)
        );
        const causesToDelete = oldCauses.filter(
          (oldCause) => !risk.causes.some((cause) => cause.id === oldCause.id)
        );
        const causesToUpdate = risk.causes.filter((cause) =>
          oldCauses.some((oldCause) => oldCause.id === cause.id)
        );
        for (const cause of causesToDelete) {
          await db.cause.delete({
            where: {
              id: cause.id,
            },
          });
        }
        for (const cause of causesToUpdate) {
          await db.cause.update({
            where: {
              id: cause.id,
            },
            data: {
              probability: cause.probability,
              type: cause.type,
            },
          });
        }
        for (const cause of newCauses) {
          await db.cause.create({
            data: {
              probability: cause.probability,
              type: cause.type,
              risk: {
                connect: {
                  id: risk.id,
                },
              },
            },
          });
        }
        await db.risk.upsert({
          where: {
            id: risk.id,
          },
          update: {
            impact: risk.impact,
            comment: risk.comment,
            consequence: risk.consequence,
            deficiencyDescription: risk.deficiencyDescription,
            riskClass: risk.riskClass,
            riskResidueLevel: risk.riskResidueLevel,
            actionPlan: {
              update: {
                qp: risk.actionPlan.qp,
                datamigration: risk.actionPlan.datamigration,
                revueConfig: risk.actionPlan.revueConfig,
                documentation: risk.actionPlan.documentation,
                qiqo: risk.actionPlan.qiqo,
              },
            },
          },
          create: {
            id: risk.id,
            impact: risk.impact,
            comment: risk.comment,
            consequence: risk.consequence,
            deficiencyDescription: risk.deficiencyDescription,
            riskClass: risk.riskClass,
            riskResidueLevel: risk.riskResidueLevel,
            URS: {
              connect: {
                id: ursId,
              },
            },
            causes: {
              createMany: {
                data: risk.causes,
              },
            },
            actionPlan: {
              create: {
                qp: risk.actionPlan.qp,
                datamigration: risk.actionPlan.datamigration,
                revueConfig: risk.actionPlan.revueConfig,
                documentation: risk.actionPlan.documentation,
                qiqo: risk.actionPlan.qiqo,
              },
            },
          },
        });
      }
    }
    if (step.name === '8_2') {
      const risks = req.body.risks as Array<RiskDto>;
      for (const risk of risks) {
        const oldTests = await db.test.findMany({
          where: {
            risk: {
              id: risk.id,
            },
          },
        });
        const testsToDelete = oldTests.filter(
          (oldTest) => !risk.tests.some((test) => test.id === oldTest.id)
        );
        for (const test of testsToDelete) {
          await db.test.delete({
            where: {
              id: test.id,
            },
          });
        }
        const newTests = risk.tests.filter(
          (test) => !oldTests.some((oldTest) => oldTest.id === test.id)
        );
        for (const test of newTests) {
          await db.test.create({
            data: {
              name: test.name,
              documentation: test.documentation,
              comments: test.comments,
              risk: {
                connect: {
                  id: risk.id,
                },
              },
            },
          });
        }
        const testsToUpdate = risk.tests.filter((test) =>
          oldTests.some((oldTest) => oldTest.id === test.id)
        );
        for (const test of testsToUpdate) {
          await db.test.update({
            where: {
              id: test.id,
            },
            data: {
              name: test.name,
              comments: test.comments,
              documentation: test.documentation,
            },
          });
        }
      }
    }
    if (step.name === '8_4') {
      await db.auditTrail.update({
        where: {
          id: req.body.auditTrail.id,
        },
        data: {
          revue: req.body.auditTrail.revue,
          revueComment: req.body.auditTrail.revueComment,
          consultation: req.body.auditTrail.consultation,
          consultationComment: req.body.auditTrail.consultationComment,
        },
      });
    }
    res.json(step);
  });

apiRouter.get('/database/projects/:id', async (req, res) => {
  if (res.locals.user?.role !== 'Collaborateur') {
    return res.status(403).json({
      message: 'You are not authorized to access this resource',
    });
  }
  const project = await db.project.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      categorySteps: {
        include: {
          _count: {
            select: {
              URS: true,
              children: true,
            },
          },
        },
      },
    },
  });
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  res.json({
    ...project,
    categorySteps:
      project?.categorySteps.map((categoryStep) => ({
        ...categoryStep,
        URSCount: categoryStep._count.URS,
        childrenCount: categoryStep._count.children,
      })) ?? [],
  } satisfies ProjectDetailDatabaseDto);
});

const getCategoryStepParents = async (parent?: CategoryStep | null) => {
  let parents: CategoryStepDto[] = [];
  let currentParent = parent;
  while (currentParent) {
    parents.unshift(currentParent);
    if (!currentParent.parentId) {
      break;
    }
    currentParent = await db.categoryStep.findUnique({
      where: {
        id: currentParent.parentId,
      },
    });
  }
  return parents;
};

apiRouter
  .post('/projects/:projectId/step', async (req, res) => {
    if (res.locals.user?.role !== 'Collaborateur') {
      return res.status(403).json({
        message: '',
      });
    }
    '[POST] Category Step :', req.body.name;
    const categoryStep = await db.categoryStep.create({
      data: {
        name: req.body.name,
        projectId: parseInt(req.params.projectId),
        parentId: req.body.parentId,
      },
    });
    res.json(categoryStep);
  })
  .get('/projects/:projectId/steps/:categoryStepId', async (req, res) => {
    const categoryStepId = req.params.categoryStepId;
    const categoryStep = await db.categoryStep.findUnique({
      where: {
        id: categoryStepId,
      },
      include: {
        URS: true,
        children: true,
        parent: true,
      },
    });
    if (!categoryStep) {
      return res.status(404).json({ message: 'Process Step not found' });
    }
    const parents = await getCategoryStepParents(categoryStep.parent);
    res.json({
      ...categoryStep,
      parents,
    } satisfies CategoryStepCompleteDto);
  });

apiRouter.use('/users', usersRouter);
apiRouter.use('/projects', projectsRouter);
apiRouter.use('/database', databaseRouter);

apiRouter.use('/api', apiRouter);
app.use('/api', apiRouter);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
