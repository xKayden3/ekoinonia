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
import { redirect, useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '../ui/use-toast';
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
import { AlertModal } from '../modal/alert-modal';
import {
  barangayFormSchema,
  BarangayFormValues
} from '@/lib/barangay-validation';
import {
  createBarangay,
  deleteBarangay,
  updateBarangay
} from '@/app/(dashboard)/dashboard/barangay/actions';

interface BarangayFormProps {
  initialData: any | null;
  cities: any;
}

export const BarangayForm: React.FC<BarangayFormProps> = ({
  initialData,
  cities
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Edit barangay' : 'Create barangay';
  const description = initialData ? 'Edit a barangay.' : 'Add a new barangay';
  const toastMessage = initialData ? 'Barangay updated.' : 'Barangay created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData
    ? initialData
    : {
        name: '',
        city_id: 0
      };

  const form = useForm<BarangayFormValues>({
    resolver: zodResolver(barangayFormSchema),
    defaultValues
  });

  const onSubmit = async (data: BarangayFormValues) => {
    const formData = new FormData();
    try {
      setLoading(true);
      if (initialData) {
        Object.entries(data).forEach(([key, value]) => {
          if (value) {
            formData.append(key, value);
          }
        });
        await updateBarangay(initialData.id, formData);
      } else {
        Object.entries(data).forEach(([key, value]) => {
          if (value) {
            formData.append(key, value);
          }
        });
        await createBarangay(formData);
      }
      toast({
        // variant: 'destructive',
        title: 'Data saved',
        description: 'Barangay entry saved successfully'
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
      await deleteBarangay(initialData.id);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
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
                  <FormLabel>Barangay</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Barangay name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Input barangay display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
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
                            ? cities.find(
                                (cities: any) => cities.id === field.value
                              )?.name
                            : 'Select city'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search city..." />
                        <CommandList>
                          <CommandEmpty>No city found.</CommandEmpty>
                          <CommandGroup>
                            {cities?.map((city: any) => (
                              <CommandItem
                                value={city.id}
                                key={city.id}
                                onSelect={() => {
                                  form.setValue('city_id', city.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    city.id === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {city.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Search from list of cities.</FormDescription>
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
