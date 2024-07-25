'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FileUpload from '../file-upload';
import { useToast } from '../ui/use-toast';
import { priestFormSchema, PriestFormValues } from '@/lib/priest-validation';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../ui/command';
import {
  createPriest,
  updatePriest
} from '@/app/(dashboard)/dashboard/priest/[priestId]/actions';

interface PriestFormProps {
  initialData: any | null;
  parishes: any;
}

export const PriestForm: React.FC<PriestFormProps> = ({
  initialData,
  parishes
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Edit priest' : 'Create priest';
  const description = initialData ? 'Edit a priest.' : 'Add a new priest';
  const toastMessage = initialData ? 'Priest updated.' : 'Priest created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData
    ? initialData
    : {
        name: '',
        parish_id: 0,
        designation: ''
      };

  const form = useForm<PriestFormValues>({
    resolver: zodResolver(priestFormSchema),
    defaultValues
  });

  const onSubmit = async (data: PriestFormValues) => {
    const formData = new FormData();
    try {
      setLoading(true);
      if (initialData) {
        Object.entries(data).forEach(([key, value]) => {
          if (value) {
            formData.append(key, value);
          }
        });
        await updatePriest(initialData.id, formData);
      } else {
        Object.entries(data).forEach(([key, value]) => {
          if (value) {
            formData.append(key, value);
          }
        });
        Object.entries(data).forEach(([key, value]) => {
          if (value) {
            formData.append(key, value);
          }
        });
        await createPriest(formData);
      }
      toast({
        // variant: 'destructive',
        title: 'Data saved',
        description: 'Priest entry saved successfully'
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      //   await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> */}
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {/* {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )} */}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            {/* <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Id</FormLabel>
                  <FormControl>
                    <Input type="number" disabled placeholder="Id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Priest name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parish_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parish</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? parishes.find(
                                (parish) => parish.id === field.value
                              )?.name
                            : 'Select parish'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search parish..." />
                        <CommandList>
                          <CommandEmpty>No parish found.</CommandEmpty>
                          <CommandGroup>
                            {parishes?.map((parish) => (
                              <CommandItem
                                value={parish.id}
                                key={parish.id}
                                onSelect={() => {
                                  form.setValue('parish_id', parish.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    parish.id === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {parish.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {/* <FormDescription>
                    This is the language that will be used in the dashboard.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Designation"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
