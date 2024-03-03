import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import axios from 'axios';
import type { URSDto } from 'backend-types';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import type { StepProps } from '~/components/URS/steps/all';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

const step9_4Schema = z.object({
  status: z.string(),
});

const Step9_4 = ({ ursId, step, readonly, setReadonly }: StepProps) => {
  const router = useRouter();
  const updateStepMutation = useMutation({
    mutationKey: ['updateStep', ursId, '9_4'],
    mutationFn: (values: z.infer<typeof step9_4Schema>) =>
      axios.put<URSDto>(`/urs/${ursId}/step/9_4`, values),
    onSuccess: () => {
      toast.success('Étape 9.4 mise à jour avec succès');
      setReadonly(true);
      router.invalidate();
    },
  });

  const form = useForm<z.infer<typeof step9_4Schema>>({
    resolver: zodResolver(step9_4Schema),
    defaultValues: step,
    disabled: readonly,
  });

  const cancel = () => {
    form.reset(step);
    setReadonly(true);
  };

  function onSubmit(values: z.infer<typeof step9_4Schema>) {
    updateStepMutation.mutate(values);
  }

  return (
    <div>
      <h2 className="font-semibold text-lg uppercase">
        ÉTAPE 9.4 | MATRICE DE TRAÇABILITÉ
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 bg-white rounded-lg p-4 gap-4 mt-2"
        >
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="col-span-2 max-w-[30ch]">
                <FormLabel>Status d'avancement</FormLabel>
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
                    <SelectItem value="na">Sans objet</SelectItem>
                    <SelectItem value="todo">A réaliser</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="finished">Terminé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {!readonly && (
            <div className="col-span-2 text-center flex items-center justify-center gap-4">
              <Button type="button" variant="secondary" onClick={cancel}>
                Annuler
              </Button>
              <Button type="submit">Valider</Button>
            </div>
          )}
          {step.updatedAt && (
            <div className="text-gray-300 uppercase col-span-2 text-sm">
              MAJ le {new Date(step.updatedAt).toLocaleDateString()} par{' '}
              {step.updatedBy}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default Step9_4;
