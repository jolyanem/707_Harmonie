import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { URSDto } from 'backend-types';
import { Edit2Icon, TrashIcon } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
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
import { useState } from 'react';

type Props = {
  urs: Pick<
    URSDto,
    | 'id'
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
  categorySteps: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string(),
      level: z.number(),
    })
  ),
});

const URSInfo = ({ urs }: Props) => {
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
      categorySteps: urs.categorySteps,
    },
    disabled: readonly,
  });
  const categoryStepsField = useFieldArray({
    control: form.control,
    name: 'categorySteps',
  });

  const cancel = () => {
    form.reset({
      name: urs.name,
      type: urs.type,
      description: urs.description,
      processType: urs.processType,
      categorySteps: urs.categorySteps,
    });
    setReadonly(true);
  };

  function onSubmit(values: z.infer<typeof ursInfoSchema>) {
    updateURSInfoMutation.mutate(values);
    setReadonly(true);
  }

  return (
    <div>
      <h1 className="font-bold text-xl">
        <span className="text-gray-500">FICHE URS | </span>
        <span>{urs.code}</span>
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white rounded-lg p-4 gap-4 mt-2 relative"
        >
          <div className="grid grid-cols-2 gap-2">
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
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
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
            {categoryStepsField.fields.map((step, index) => (
              <div key={step.id} className="w-full flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`categorySteps.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Process step level {index + 1}</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {!readonly && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="mt-auto mb-0.5"
                    onClick={() => categoryStepsField.remove(index)}
                  >
                    <TrashIcon size={18} />
                  </Button>
                )}
              </div>
            ))}
            {!readonly && (
              <div className="col-span-2 text-center">
                <Button
                  type="button"
                  className="mt-2"
                  onClick={() =>
                    categoryStepsField.append({
                      id: uuid(),
                      name: '',
                      level: categoryStepsField.fields.length + 1,
                    })
                  }
                >
                  Ajouter un process step
                </Button>
              </div>
            )}
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
