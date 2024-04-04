/* eslint-disable react-hooks/rules-of-hooks */
import { useNavigate } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { ProjectDetailDatabaseDto, ProjectDto } from 'backend-types';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';

export type ProjectRow = Pick<
  ProjectDto,
  'id' | 'client' | 'name' | 'createdAt'
>;
export type CategoryStepRow = Pick<
  ProjectDetailDatabaseDto['categorySteps'][0],
  'id' | 'name' | 'URSCount' | 'childrenCount'
> & {
  projectId: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defaultColumn: Partial<ColumnDef<any>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);

    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <Input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        className="bg-transparent border-none w-full"
      />
    );
  },
};

export const projectsColumns: ColumnDef<ProjectRow>[] = [
  {
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
    header: 'Créé le',
    accessorFn: (row) =>
      new Date(row.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
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
                  to: '/database/projects/$projectId',
                  params: { projectId: project.id.toString() },
                });
              }}
            >
              Inspecter
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigate({
                  to: '/projects/$projectId',
                  params: { projectId: project.id.toString() },
                });
              }}
            >
              Voir le projet
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

export const categoryStepColumns: ColumnDef<CategoryStepRow>[] = [
  {
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
    header: "Nombre d'URS",
    accessorFn: (row) => row.URSCount,
    cell: ({ row }) =>
      row.original.URSCount > 0 ? row.original.URSCount : 'Aucun',
  },
  {
    header: "Nombre d'étapes enfants",
    accessorFn: (row) => row.childrenCount,
    cell: ({ row }) =>
      row.original.childrenCount > 0 ? row.original.childrenCount : 'Aucun',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const navigate = useNavigate();
      const categoryStep = row.original;

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
                  to: '/projects/$projectId/steps/$stepId',
                  params: {
                    projectId: categoryStep.projectId.toString(),
                    stepId: categoryStep.id,
                  },
                });
              }}
            >
              Inspecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
