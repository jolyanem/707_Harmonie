import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import axios from 'axios';
import type { URSDto } from 'backend-types';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import { STEP_NAMES } from '~/components/URS/steps/all';

type StatusStepWrapperProps = {
  ursId: URSDto['id'];
  step: URSDto['steps'][number];
  readonly: boolean;
};

const stepStatusSchema = z.object({
  status: z.string(),
});

const StatusStepWrapper = ({
  ursId,
  step,
  readonly,
}: StatusStepWrapperProps) => {
  const router = useRouter();
  const updateStepMutation = useMutation({
    mutationKey: ['updateStep', ursId, '3_2'],
    mutationFn: (values: z.infer<typeof stepStatusSchema>) =>
      axios.put<URSDto>(`/urs/${ursId}/step/${step.name}/status`, values),
    onSuccess: () => {
      toast.success(
        `État de l'étape ${step.name.replace('_', '.')} mise à jour avec succès`
      );
      router.invalidate();
    },
  });

  const form = useForm<z.infer<typeof stepStatusSchema>>({
    resolver: zodResolver(stepStatusSchema),
    defaultValues: step,
    disabled: readonly,
  });

  function onSubmit(values: z.infer<typeof stepStatusSchema>) {
    updateStepMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="col-span-2 max-w-[30ch]">
              <FormLabel className="normal-case">
                {STEP_NAMES[step.name as keyof typeof STEP_NAMES] ?? step.name}
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  form.setValue('status', value);
                  form.handleSubmit(onSubmit)();
                }}
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
      </form>
    </Form>
  );
};

type AllStepsStatusProps = {
  ursId: URSDto['id'];
  steps: URSDto['steps'];
};

const AllStepsStatus = ({ ursId, steps }: AllStepsStatusProps) => {
  return (
    <section>
      <h2 className="font-semibold text-lg uppercase">
        Status d'avancement des étapes
      </h2>
      <div className="grid grid-cols-3 bg-white rounded-lg p-4 gap-4 mt-2">
        {steps.map((step) => (
          <StatusStepWrapper
            key={step.name}
            ursId={ursId}
            step={step}
            readonly={false}
          />
        ))}
      </div>
    </section>
  );
};

export default AllStepsStatus;
