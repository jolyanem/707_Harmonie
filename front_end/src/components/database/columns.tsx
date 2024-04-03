import { useNavigate } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { ProjectDto } from 'backend-types';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

export type Project = Pick<ProjectDto, 'id' | 'client' | 'name' | 'createdAt'>;

export const projectsColumns: ColumnDef<Project>[] = [
  {
    id: 'nom',
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="shadow-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: 'client',
    accessorKey: 'client',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="shadow-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Créé le',
    cell: ({ row }) => (
      <div>
        {new Date(row.getValue<Date>('createdAt')).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const navigate = useNavigate();
      const project = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                navigate({
                  to: '/projects/$projectId',
                  params: { projectId: project.id.toString() },
                });
              }}
            >
              Inspecter
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigate({
                  to: '/projects/$projectId/diagram',
                  params: { projectId: project.id.toString() },
                });
              }}
            >
              Voir logigramme
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
