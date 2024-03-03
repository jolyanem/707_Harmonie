import express from 'express';
import cors from 'cors';
import { db } from './db';
import type {
  ProjectDetailedDto,
  ProjectDto,
  RiskDto,
  SupplierResponsesDto,
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
        supplierResponses: true,
        auditTrail: true,
        risks: {
          include: {
            causes: true,
            actionPlan: true,
          },
        },
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
        criticalityClient: 'na',
        criticalityVSI: 'na',
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
    for (let index = 0; index < body.categorySteps.length; index++) {
      const step = body.categorySteps[index]!;
      await db.categoryStep.upsert({
        where: {
          id: step.id,
        },
        update: {
          name: step.name,
          level: index + 1,
        },
        create: {
          id: step.id,
          name: step.name,
          level: index + 1,
          URS: {
            connect: {
              id: urs.id,
            },
          },
        },
      });
    }
    res.json(urs satisfies URSShortDto);
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
    if (step.name === '1_3') {
      await db.uRS.update({
        where: {
          id: ursId,
        },
        data: {
          criticalityClient: req.body.criticalityClient,
          criticalityVSI: req.body.criticalityVSI,
        },
      });
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

app
  .get('/projects', async (req, res) => {
    console.log('[GET] Projects');
    const projects = await db.project.findMany();
    res.json(projects satisfies Array<ProjectDto>);
  })
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
        supplierResponses: true,
        auditTrail: true,
        risks: {
          include: {
            causes: true,
            actionPlan: true,
          },
        },
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
