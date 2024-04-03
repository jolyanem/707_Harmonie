import { Link } from '@tanstack/react-router';
import { WorkflowIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';

type Props = {
  projectId: string;
};

const LinkToDiagram = ({ projectId }: Props) => {
  return (
    <Button asChild size="icon">
      <Link to="/projects/$projectId/diagram" params={{ projectId }}>
        <WorkflowIcon />
      </Link>
    </Button>
  );
};

export default LinkToDiagram;
