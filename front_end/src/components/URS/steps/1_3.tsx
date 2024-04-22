import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import axios from 'axios';
import type { URSDto } from 'backend-types';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { type StepProps } from '~/components/URS/steps/all';
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
  regulatoryObligation: string;
  businessObligation: string;
};

const step1_3Schema = z.object({
  status: z.string(),
  criticalityClient: z.string(),
  regulatoryObligation: z.string(),
  businessObligation: z.string(),
});

const Step1_3 = ({
  ursId,
  step,
  readonly,
  setReadonly,
  criticalityClient,
  regulatoryObligation,
  businessObligation,
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
      regulatoryObligation: regulatoryObligation,
      businessObligation: businessObligation,
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-3 bg-white rounded-lg p-4 gap-4 mt-2"
      >
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
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="regulatoryObligation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Obligation Réglementaire</FormLabel>
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
                  <SelectItem value="Y">Oui</SelectItem>
                  <SelectItem value="N">Non</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="businessObligation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Obligation Business</FormLabel>
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
                  <SelectItem value="Y">Oui</SelectItem>
                  <SelectItem value="N">Non</SelectItem>
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
  );
};

export default Step1_3;
