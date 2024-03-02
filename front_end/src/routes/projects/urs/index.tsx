import { useParams } from '@tanstack/react-router';
import CreateURSDialog from '~/components/URS/CreateURSDialog';

const URSListPage = () => {
  const { projectId } = useParams({
    from: '/projects/$projectId/urs',
  });
  return (
    <div>
      <CreateURSDialog projectId={projectId} />
      <h1>Liste des URS</h1>
      <ul>{/*TODO Liste des URS*/}</ul>
    </div>
  );
};

export default URSListPage;
