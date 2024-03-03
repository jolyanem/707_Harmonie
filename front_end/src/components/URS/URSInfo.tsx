import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { URSDto } from 'backend-types';
import { TrashIcon } from 'lucide-react';
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
  };

  function onSubmit(values: z.infer<typeof ursInfoSchema>) {
    console.log(values);
    updateURSInfoMutation.mutate(values);
  }

  return (
    <div>
      <h1 className="font-bold text-xl">FICHE URS | {urs.code}</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white rounded-lg p-4 gap-4 mt-2"
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
          <Separator className="my-4" />
          <div className="grid grid-cols-2">
            <FormField
              control={form.control}
              name={`processType`}
              render={({ field }) => (
                <FormItem className="w-[30ch] mt-1">
                  <FormLabel>Process type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="achats">Achats</SelectItem>
                        <SelectItem value="stocks">Stocks</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <FormLabel>Process step level {step.level}</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="mt-auto mb-0.5"
                  onClick={() => categoryStepsField.remove(index)}
                >
                  <TrashIcon size={18} />
                </Button>
              </div>
            ))}
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
          </div>
          <div className="mt-4 text-center flex items-center justify-center gap-4">
            <Button type="button" variant="secondary" onClick={cancel}>
              Annuler
            </Button>
            <Button type="submit">Valider</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default URSInfo;
