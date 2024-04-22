/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import diagram from '~/assets/base.bpmn?raw';

import { useEffect } from 'react';
import {
  createLazyRoute,
  useLoaderData,
  useNavigate,
} from '@tanstack/react-router';
import Canvas from 'diagram-js/lib/core/Canvas';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import ElementFactory from 'diagram-js/lib/core/ElementFactory';
import type { Element } from 'diagram-js/lib/model';
import Modeling from 'diagram-js/lib/features/modeling/Modeling';
import { EventBus } from 'diagram-js/lib/features/interaction-events/InteractionEvents';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory';
import { Parent } from 'bpmn-js/lib/model/Types';

const ProjectDiagramPage = () => {
  const navigate = useNavigate();
  const project = useLoaderData({
    from: '/projects/$projectId/diagram',
  });

  useEffect(() => {
    const modeler = new BpmnModeler({ container: '#canvas', height: '92vh' });

    modeler.importXML(diagram).then(() => {
      const bpmnFactory = modeler.get<BpmnFactory>('bpmnFactory'),
        elementFactory = modeler.get<ElementFactory>('elementFactory'),
        elementRegistry = modeler.get<ElementRegistry>('elementRegistry'),
        modeling = modeler.get<Modeling>('modeling');

      const proc = elementRegistry.get('Process') as Parent | undefined,
        startEvent = elementRegistry.get('Start') as Element | undefined;

      if (!proc || !startEvent) {
        return;
      }

      startEvent.businessObject.name = project.name;

      const renderURS = (
        xStart: number,
        y: number,
        step: (typeof project.categorySteps)[0],
        parentId: string
      ) => {
        const parent = elementRegistry.get(parentId) as Element | undefined;
        if (!parent) {
          return;
        }
        let x = xStart;
        for (const urs of step.URS) {
          const taskBusinessObject = bpmnFactory.create('bpmn:ServiceTask', {
            id: urs.id,
            name: urs.name,
          });

          const task = elementFactory.createShape({
            type: 'bpmn:ServiceTask',
            businessObject: taskBusinessObject,
          });

          modeling.createShape(task, { x, y }, proc);

          modeling.connect(parent, task);

          x += 130;
        }
      };

      const renderCategoryStepChildren = (
        yStart: number,
        step: (typeof project.categorySteps)[0],
        parentId: string
      ) => {
        const parent = elementRegistry.get(parentId) as Element | undefined;
        if (!parent) {
          return;
        }
        for (const child of step.children) {
          const taskBusinessObject = bpmnFactory.create('bpmn:Task', {
            id: child.id,
            name: child.name,
          });

          const task = elementFactory.createShape({
            type: 'bpmn:Task',
            businessObject: taskBusinessObject,
          });

          modeling.createShape(task, { x: 218, y: yStart }, proc);

          modeling.connect(parent, task, undefined);

          renderCategoryStepChildren(yStart + 110, child, child.id);
          renderURS(400, yStart, child, child.id);
        }
      };

      let x = 218;
      for (const step of project.categorySteps) {
        const taskBusinessObject = bpmnFactory.create('bpmn:Task', {
          id: step.id,
          name: step.name,
        });

        const task = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject: taskBusinessObject,
        });

        modeling.createShape(task, { x, y: 200 }, proc);

        modeling.connect(startEvent, task);

        renderURS(x + 200, 200, step, step.id);
        renderCategoryStepChildren(300, step, step.id);

        x += 400;
      }

      // modeler
      //   .saveXML({
      //     format: true,
      //     preamble: false,
      //   })
      //   .then((xml) => {
      //     console.log(xml.xml);
      //     layoutProcess(xml.xml).then((layoutedXml) => {
      //       modeler.importXML(layoutedXml);
      //     });
      //   });

      const canvas = modeler.get<Canvas>('canvas');
      canvas.zoom('fit-viewport');

      const eventBus = modeler.get<EventBus>('eventBus');

      eventBus.on('element.click', (e) => {
        const element = e.element;
        if (element.type === 'bpmn:Task') {
          navigate({
            to: '/projects/$projectId/steps/$stepId',
            params: { projectId: project.id.toString(), stepId: element.id },
          });
        } else if (element.type === 'bpmn:ServiceTask') {
          navigate({
            to: '/projects/$projectId/urs/$id',
            params: { projectId: project.id.toString(), id: element.id },
          });
        } else if (element.type === 'bpmn:StartEvent') {
          navigate({
            to: '/projects/$projectId',
            params: { projectId: project.id.toString() },
          });
        }
      });
    });

    return () => {
      modeler.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1 className="font-bold text-2xl">{project.name}</h1>
      <div id="canvas"></div>
    </div>
  );
};

export const ProjectDiagramPageRoute = createLazyRoute(
  '/projects/$projectId/diagram'
)({
  component: ProjectDiagramPage,
});
