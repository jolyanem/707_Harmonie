import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { URSDto } from 'backend-types';
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

type Props = {
  urs: Pick<
    URSDto,
    'id' | 'name' | 'code' | 'type' | 'description' | 'categorySteps'
  >;
};

const ursInfoSchema = z.object({
  name: z.string().min(2).max(50),
  type: z.string(),
  description: z.string().max(400),
  categorySteps: z.array(
    z.object({
      // id: z.string(),
      name: z.string(),
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
    },
  });

  const cancel = () => {
    form.reset({
      name: urs.name,
      type: urs.type,
      description: urs.description,
    });
  };

  function onSubmit(values: z.infer<typeof ursInfoSchema>) {
    updateURSInfoMutation.mutate(values);
  }

  return (
    <div>
      <h1 className="font-bold text-xl">FICHE URS | {urs.code}</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 bg-white rounded-lg p-4 gap-4 mt-2"
        >
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
          <hr className="col-span-2 mx-16" />
          <div className="col-span-2 text-center flex items-center justify-center gap-4">
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
