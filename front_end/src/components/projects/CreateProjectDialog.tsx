import { BookOpenTextIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { ProjectCreateDto, ProjectDto } from 'backend-types';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Textarea } from '~/components/ui/textarea';

type Props = {
  project?: ProjectDto;
};

const createProjectSchema = z.object({
  name: z.string().min(2).max(50),
  client: z.string().min(2).max(50),
  objective: z.string().min(2).max(50),
  clientProjectLead: z.string().min(2).max(50),
  clientQualityRepresentative: z.string().min(2).max(50),
  leadAMOA: z.string().min(2).max(50),
  leadValidation: z.string().min(2).max(50),
  providersMacro: z.array(z.object({ value: z.string().min(2).max(50) })),
  providersDetailed: z.array(z.object({ value: z.string().min(2).max(50) })),
  applicableRegulations: z.string().min(2).max(50),
});

const CreateProjectDialog = ({ project }: Props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const createProjectMutation = useMutation({
    mutationKey: ['createProject'],
    mutationFn: (
      values: Omit<
        z.infer<typeof createProjectSchema>,
        'providersMacro' | 'providersDetailed'
      > & {
        providersMacro: string[];
        providersDetailed: string[];
      }
    ) => axios.post<ProjectDto>(`/projects`, values satisfies ProjectCreateDto),
    onSuccess: (res) => {
      toast.success('Project créé avec succès');
      setOpen(false);
      navigate({
        to: `/projects/$projectId`,
        params: {
          projectId: res.data.id.toString(),
        },
      });
    },
  });
  const updateProjectMutation = useMutation({
    mutationKey: ['updateProject', project?.id],
    mutationFn: (
      values: Omit<
        z.infer<typeof createProjectSchema>,
        'providersMacro' | 'providersDetailed'
      > & {
        providersMacro: string[];
        providersDetailed: string[];
      }
    ) =>
      axios.patch<ProjectDto>(
        `/projects/${project?.id}`,
        values satisfies ProjectCreateDto
      ),
    onSuccess: () => {
      toast.success('Project mis à jour avec succès');
      setOpen(false);
    },
  });

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: project?.name ?? '',
      client: project?.client ?? '',
      objective: project?.objective ?? '',
      clientProjectLead: project?.clientProjectLead ?? '',
      clientQualityRepresentative: project?.clientQualityRepresentative ?? '',
      leadAMOA: project?.leadAMOA ?? '',
      leadValidation: project?.leadValidation ?? '',
      providersMacro:
        project?.providersMacro.map((x) => ({
          value: x,
        })) ?? [],
      providersDetailed:
        project?.providersDetailed.map((x) => ({
          value: x,
        })) ?? [],
      applicableRegulations: project?.applicableRegulations ?? '',
    },
  });
  const providersMacroFieldArray = useFieldArray({
    control: form.control,
    name: 'providersMacro',
  });
  const providersDetailedFieldArray = useFieldArray({
    control: form.control,
    name: 'providersDetailed',
  });

  function onSubmit(values: z.infer<typeof createProjectSchema>) {
    const newValues = {
      ...values,
      providersMacro: values.providersMacro.map((x) => x.value),
      providersDetailed: values.providersDetailed.map((x) => x.value),
    };
    if (project) {
      updateProjectMutation.mutate(newValues);
      return;
    }
    createProjectMutation.mutate(newValues);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {project ? (
          <Button variant="secondary" size="icon">
            <BookOpenTextIcon />
          </Button>
        ) : (
          <Button variant="secondary" className="gap-2">
            <PlusIcon size={20} />
            Nouveau Projet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Modifier le projet' : 'Créer un nouveau projet'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 grid-cols-2 divide-x divide-gray-200"
          >
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Nom du projet</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Client</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="objective"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Rappel d'objectif</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientProjectLead"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Lead Client</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientQualityRepresentative"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Représentant Qualité Client</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leadAMOA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead AMOA</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leadValidation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Validation</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="applicableRegulations"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Réglementations Applicables</FormLabel>
                    <FormControl>
                      <Textarea placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2 pl-2">
              <FormLabel>Prestataires macro</FormLabel>
              {providersMacroFieldArray.fields.length === 0 ? (
                <div className="text-gray-400">Aucun</div>
              ) : (
                providersMacroFieldArray.fields.map((_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`providersMacro.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="col-span-2 flex items-center gap-2">
                        <FormControl>
                          <>
                            <Input placeholder="" {...field} />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                providersMacroFieldArray.remove(index);
                              }}
                            >
                              <TrashIcon size="16" />
                            </Button>
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))
              )}
              <FormLabel>Prestataires détaillés</FormLabel>
              {providersDetailedFieldArray.fields.length === 0 ? (
                <div className="text-gray-400">Aucun</div>
              ) : (
                providersDetailedFieldArray.fields.map((_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`providersDetailed.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="col-span-2 flex items-center gap-2">
                        <FormControl>
                          <>
                            <Input placeholder="" {...field} />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                providersDetailedFieldArray.remove(index);
                              }}
                            >
                              <TrashIcon size="16" />
                            </Button>
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))
              )}
              <div className="flex items-center justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="secondary" size="sm">
                      Ajouter un prestataire
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        providersMacroFieldArray.append({ value: '' });
                      }}
                      className="flex items-center justify-between group"
                    >
                      <PlusIcon size="16" className="text-slate-500" />
                      Macro
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        providersDetailedFieldArray.append({ value: '' });
                      }}
                      className="flex items-center justify-between group"
                    >
                      <PlusIcon size="16" className="text-slate-500" />
                      Détaillé
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="text-center flex items-center justify-center gap-4 col-span-2">
              <Button type="submit">{project ? 'Modifier' : 'Créer'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
