import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import diagram from '~/assets/base.bpmn?raw';

import { useLoaderData, useNavigate } from '@tanstack/react-router';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import ElementFactory from 'diagram-js/lib/core/ElementFactory';
import Modeling from 'diagram-js/lib/features/modeling/Modeling';
import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory';
import Canvas from 'diagram-js/lib/core/Canvas';
import { Element } from 'diagram-js/lib/model';
import { useEffect } from 'react';
import { Parent } from 'bpmn-js/lib/model/Types';
import { EventBus } from 'diagram-js/lib/features/interaction-events/InteractionEvents';
import { layoutProcess } from 'bpmn-auto-layout';

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

          modeling.connect(parent, task);

          renderCategoryStepChildren(yStart + 110, child, child.id);
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

        renderCategoryStepChildren(300, step, step.id);

        x += 130;
      }

      // v.saveXML().then((xml) => {
      //   layoutProcess(xml.xml).then((layoutedXml) => {
      //     v.importXML(layoutedXml);
      //   });
      // });

      const canvas = modeler.get<Canvas>('canvas');
      canvas.zoom('fit-viewport');

      const eventBus = modeler.get<EventBus>('eventBus');

      eventBus.on('element.click', (e) => {
        console.log(e);
        const element = e.element;
        if (element.type === 'bpmn:Task') {
          console.log('Task clicked');
          navigate({
            to: '/projects/$projectId/steps/$stepId',
            params: { projectId: project.id.toString(), stepId: element.id },
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

export default ProjectDiagramPage;
