import { useLoaderData } from '@tanstack/react-router';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';

import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import diagram from '~/assets/base.bpmn?raw';

import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import ElementFactory from 'diagram-js/lib/core/ElementFactory';
import Modeling from 'diagram-js/lib/features/modeling/Modeling';
import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory';
import Canvas from 'diagram-js/lib/core/Canvas';
import { Element } from 'diagram-js/lib/model';
import { useEffect, useState } from 'react';
import { Parent } from 'bpmn-js/lib/model/Types';

const ProjectDiagramPage = () => {
  const [viewer, setViewer] = useState<BpmnModeler | undefined>();
  const project = useLoaderData({
    from: '/projects/$projectId/diagram',
  });

  useEffect(() => {
    if (viewer !== undefined) {
      return;
    }
    const v = new BpmnModeler({ container: '#canvas', height: '100vh' });
    setViewer(v);

    v.importXML(diagram).then(() => {
      const bpmnFactory = v.get<BpmnFactory>('bpmnFactory'),
        elementFactory = v.get<ElementFactory>('elementFactory'),
        elementRegistry = v.get<ElementRegistry>('elementRegistry'),
        modeling = v.get<Modeling>('modeling');

      const proc = elementRegistry.get('Process_1') as Parent | undefined,
        startEvent = elementRegistry.get('Start') as Element | undefined;

      if (!proc || !startEvent) {
        return;
      }

      let y = 150;
      let lastStep = startEvent;
      for (const step of Object.entries(project.categorySteps)) {
        const taskBusinessObject = bpmnFactory.create('bpmn:Task', {
          id: step[0],
          name: step[0],
        });

        const task = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject: taskBusinessObject,
        });

        modeling.createShape(task, { x: 218, y }, proc);

        modeling.connect(lastStep, task);

        lastStep = task;
        y += 110;
      }

      const canvas = v.get<Canvas>('canvas');
      canvas.zoom('fit-viewport');
    });

    return () => {
      v.destroy();
      setViewer(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div id="canvas"></div>
    </div>
  );
};

export default ProjectDiagramPage;
