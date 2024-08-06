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
import { AlertModal } from '../modal/alert-modal';
import { cityFormSchema, CityFormValues } from '@/lib/city-validation';
import {
  createCity,
  deleteCity,
  updateCity
} from '@/app/(dashboard)/dashboard/city/actions';

interface CityFormProps {
  initialData: any | null;
  provinces: any;
}

export const CityForm: React.FC<CityFormProps> = ({
  initialData,
  provinces
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Edit city' : 'Create city';
  const description = initialData ? 'Edit a city.' : 'Add a new city';
  const toastMessage = initialData ? 'City updated.' : 'City created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData
    ? initialData
    : {
        name: '',
        province_id: 0
      };

  const form = useForm<CityFormValues>({
    resolver: zodResolver(cityFormSchema),
    defaultValues
  });

  const onSubmit = async (data: CityFormValues) => {
    const formData = new FormData();
    try {
      setLoading(true);
      if (initialData) {
        Object.entries(data).forEach(([key, value]) => {
          if (value) {
            formData.append(key, value);
          }
        });
        await updateCity(initialData.id, formData);
      } else {
        Object.entries(data).forEach(([key, value]) => {
          if (value) {
            formData.append(key, value);
          }
        });
        await createCity(formData);
      }
      toast({
        // variant: 'destructive',
        title: 'Data saved',
        description: 'City entry saved successfully'
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
      await deleteCity(initialData.id);
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
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="City name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Input city display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="province_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
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
                            ? provinces.find(
                                (provinces: any) => provinces.id === field.value
                              )?.name
                            : 'Select province'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search province..." />
                        <CommandList>
                          <CommandEmpty>No province found.</CommandEmpty>
                          <CommandGroup>
                            {provinces?.map((province: any) => (
                              <CommandItem
                                value={province.id}
                                key={province.id}
                                onSelect={() => {
                                  form.setValue('province_id', province.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    province.id === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {province.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Search from list of provinces.
                  </FormDescription>
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
