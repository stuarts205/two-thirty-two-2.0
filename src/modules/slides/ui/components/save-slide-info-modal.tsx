'use client'
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { trpc } from '@/trpc/client'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import ResponsiveModal from '@/components/responsive-modal'
import { Input } from '@/components/ui/input'
import { slideUpdateSchema } from '@/db/schema'

interface SlideinfoModalProps {
    open: boolean
    image: string
    onOpenChange: (open: boolean) => void
}

const SaveSlideInfoModal = ({image, open, onOpenChange}:SlideinfoModalProps) => {  
  const [slide] = trpc.slides.getOne.useSuspenseQuery({ image }); 

  const form = useForm<z.infer<typeof slideUpdateSchema>>({
    resolver: zodResolver(slideUpdateSchema),
    defaultValues: slide ? {
      description: slide.description,
      people: slide.people,
      approxDate: slide.approxDate,
    } : {
      description: "",
      people: "",
      approxDate: "",
    },
  })

  useEffect(() => {
    if (slide) {
      form.reset(slide);
    }
  }, [slide, form]);

  const update = trpc.slides.update.useMutation({
    onSuccess: () => {
      toast.success('Slide information updated successfully!');
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast.error('Failed to update slide information.');    
    },
  });
  
  const onSubmit = (data: z.infer<typeof slideUpdateSchema>) => {
    update.mutateAsync({ ...data, image });
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset()    
  }  

  return (
    <ResponsiveModal title='Update this silde information' open={open} onOpenChange={onOpenChange}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What is this slide</FormLabel>
                  <FormControl>
                    <Textarea {...field}
                    className='resize-none' cols={30} rows={3} placeholder='A description of what this slide is' />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='people'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Who is in the slide</FormLabel>
                  <FormControl>
                  <Textarea {...field}
                    className='resize-none' cols={30} rows={5} placeholder='All the people/places in this slide' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='approxDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aproximate date of this slide</FormLabel>
                  <FormControl>
                  <Input {...field}
                    placeholder='Approximate date' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type='submit'>Save</Button>
              <Button variant='ghost' type='button' onClick={handleCancel}>Cancel</Button>
            </div>
          </form>
        </Form>
    </ResponsiveModal>
  )
}

export default SaveSlideInfoModal