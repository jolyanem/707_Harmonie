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

type Props = StepProps & {
  criticalityClient: string;
  criticalityVSI: string;
};

const step1_3Schema = z.object({
  status: z.string(),
  criticalityClient: z.string(),
  criticalityVSI: z.string(),
});

const Step1_3 = ({
  ursId,
  step,
  readonly,
  setReadonly,
  criticalityClient,
  criticalityVSI,
}: Props) => {
  const router = useRouter();
  const updateStepMutation = useMutation({
    mutationKey: ['updateStep', ursId, '1_3'],
    mutationFn: (values: z.infer<typeof step1_3Schema>) =>
      axios.put<URSDto>(`/urs/${ursId}/step/1_3`, values),
    onSuccess: () => {
      toast.success('Étape 1.3 mise à jour avec succès');
      setReadonly(true);
      router.invalidate();
    },
  });

  const form = useForm<z.infer<typeof step1_3Schema>>({
    resolver: zodResolver(step1_3Schema),
    defaultValues: {
      ...step,
      criticalityClient: criticalityClient,
      criticalityVSI: criticalityVSI,
    },
    disabled: readonly,
  });

  const cancel = () => {
    setReadonly(true);
    form.reset(step);
  };

  function onSubmit(values: z.infer<typeof step1_3Schema>) {
    updateStepMutation.mutate(values);
  }

  return (
    <div>
      <h2 className="font-semibold text-lg uppercase">
        ÉTAPE 1.3 | ÉTUDE CRITICITÉ
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
          <FormField
            control={form.control}
            name="criticalityClient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Criticité Client</FormLabel>
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
                    <SelectItem value="na">Non renseigné</SelectItem>
                    <SelectItem value="N">Non</SelectItem>
                    <SelectItem value="Y">Oui</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="criticalityVSI"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Criticité VSI</FormLabel>
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
                    <SelectItem value="na">Non renseigné</SelectItem>
                    <SelectItem value="N">Non</SelectItem>
                    <SelectItem value="Y">Oui</SelectItem>
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
            <div className="text-gray-300 uppercase text-sm col-span-2">
              MAJ le {new Date(step.updatedAt).toLocaleDateString()} par{' '}
              {step.updatedBy}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default Step1_3;
