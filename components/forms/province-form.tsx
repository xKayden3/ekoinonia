'use client';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { redirect, useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
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
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../ui/use-toast';
import {
  provinceFormSchema,
  ProvinceFormValues
} from '@/lib/province-validation';
import { revalidatePath } from 'next/cache';
import {
  createProvince,
  deleteProvince,
  updateProvince
} from '@/app/(dashboard)/dashboard/province/actions';
import { AlertModal } from '../modal/alert-modal';

interface ProvinceFormProps {
  initialData: any | null;
}

export const ProvinceForm: React.FC<ProvinceFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [imgLoading, setImgLoading] = useState(false);
  const title = initialData ? 'Edit province' : 'Create province';
  const description = initialData ? 'Edit a province.' : 'Add a new province';
  const toastMessage = initialData ? 'Province updated.' : 'Province created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData
    ? initialData
    : {
        name: ''
        // description: '',
        // price: 0,
        // imgUrl: [],
        // category: ''
      };

  const form = useForm<ProvinceFormValues>({
    resolver: zodResolver(provinceFormSchema),
    defaultValues
  });

  const onSubmit = async (data: ProvinceFormValues) => {
    const formData = new FormData();

    try {
      setLoading(true);
      if (initialData) {
        Object.entries(data).forEach(([key, value]) => {
          if (value) {
            formData.append(key, value);
          }
        });
        await updateProvince(initialData.id, formData);
      } else {
        Object.entries(data).forEach(([key, value]) => {
          if (value) {
            formData.append(key, value);
          }
        });
        await createProvince(formData);
      }
      toast({
        // variant: 'destructive',
        title: 'Data saved',
        description: 'Province entry saved successfully'
      });

      // router.refresh();
      // router.push(`/dashboard/parish`);
    } catch (error: any) {
      toast({
        // variant: 'destructive',
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
      await deleteProvince(initialData.id);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  // const triggerImgUrlValidation = () => form.trigger('imgUrl');

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
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          {/* <FormField
            control={form.control}
            name="imgUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <FileUpload
                    onChange={field.onChange}
                    value={field.value}
                    onRemove={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
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
                  <FormLabel>Province</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Province name"
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
