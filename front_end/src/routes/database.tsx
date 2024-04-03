import { useLoaderData } from '@tanstack/react-router';
import { projectsColumns } from '~/components/database/columns';
import { DataTable } from '~/components/database/data-table';

const DatabasePage = () => {
  const projects = useLoaderData({
    from: '/database',
  });
  return (
    <div className="container mx-auto">
      <DataTable
        columns={projectsColumns}
        data={projects}
        filterableColumns={['nom', 'client']}
      />
    </div>
  );
};

export default DatabasePage;
