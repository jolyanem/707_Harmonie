import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { URSDto } from 'backend-types';
import { Edit2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { Separator } from '~/components/ui/separator';
import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Link, useParams } from '@tanstack/react-router';
import LinkToDiagram from '~/components/LinkToDiagram';

type Props = {
  urs: Pick<
    URSDto,
    | 'id'
    | 'createdAt'
    | 'name'
    | 'code'
    | 'type'
    | 'description'
    | 'categorySteps'
    | 'processType'
  >;
};

const ursInfoSchema = z.object({
  name: z.string().min(2).max(50),
  type: z.string(),
  description: z.string().max(400),
  processType: z.string(),
});

const URSInfo = ({ urs }: Props) => {
  const { projectId } = useParams({
    from: '/projects/$projectId/urs/$id',
  });
  const [readonly, setReadonly] = useState(true);
  const updateURSInfoMutation = useMutation({
    mutationKey: ['updateURSInfo', urs.id],
    mutationFn: (values: z.infer<typeof ursInfoSchema>) =>
      axios.put<URSDto>(`/urs/${urs.id}`, values),
    onSuccess: () => {
      toast.success("Informations de l'URS mises à jour avec succès");
    },
  });
  const form = useForm<z.infer<typeof ursInfoSchema>>({
    resolver: zodResolver(ursInfoSchema),
    defaultValues: {
      name: urs.name,
      type: urs.type,
      description: urs.description,
      processType: urs.processType,
    },
    disabled: readonly,
  });

  const cancel = () => {
    form.reset({
      name: urs.name,
      type: urs.type,
      description: urs.description,
      processType: urs.processType,
    });
    setReadonly(true);
  };

  function onSubmit(values: z.infer<typeof ursInfoSchema>) {
    updateURSInfoMutation.mutate(values);
    setReadonly(true);
  }

  return (
    <div>
      <header className="flex justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to="/projects/$projectId"
                  params={{
                    projectId: projectId,
                  }}
                >
                  Projet
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {urs.categorySteps.map((categoryStep) => (
              <React.Fragment key={categoryStep.id}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      to="/projects/$projectId/steps/$stepId"
                      params={{
                        projectId: projectId,
                        stepId: categoryStep.id,
                      }}
                    >
                      {categoryStep.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{urs.code}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <LinkToDiagram projectId={projectId} />
      </header>
      <h1 className="font-bold text-2xl mt-4">
        <span className="text-gray-500">FICHE URS | </span>
        <span>{urs.code}</span>
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white rounded-lg p-4 gap-4 mt-2 relative"
        >
          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'URS</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de besoin</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={field.disabled}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="macro">Macro</SelectItem>
                      <SelectItem value="detailed">Détaillé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Créé le</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  value={new Date(urs.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Description de l'URS</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator className="my-4 w-3/4 mx-auto" />
          <div className="grid grid-cols-2">
            <FormField
              control={form.control}
              name={`processType`}
              render={({ field }) => (
                <FormItem className="w-[30ch] mt-1">
                  <FormLabel>Process type</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {urs.categorySteps.map((categoryStep, index) => (
              <div
                className="w-full flex items-center gap-2"
                key={categoryStep.id}
              >
                <FormField
                  name="categoryStep"
                  disabled
                  defaultValue={categoryStep.name}
                  render={({ field }) => (
                    <FormItem className="w-[30ch] mt-1">
                      <FormLabel>Process step level {index + 1}</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
          {!readonly && (
            <div className="mt-4 text-center flex items-center justify-center gap-4">
              <Button type="button" variant="secondary" onClick={cancel}>
                Annuler
              </Button>
              <Button type="submit">Valider</Button>
            </div>
          )}
          {readonly && (
            <Button
              size="icon"
              className="p-O h-6 w-6 rounded-md absolute top-1 right-1.5 bg-slate-700 hover:bg-slate-900"
              onClick={() => setReadonly(!readonly)}
            >
              <Edit2Icon size="12" />
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default URSInfo;
