"use client"

import { Heading } from "@/components/heading";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { formSchema } from "./contants";

import axios from "axios"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { VideoIcon } from "lucide-react";
import { ControllerFieldState, ControllerRenderProps, FieldValues, UseFormStateReturn, useForm } from "react-hook-form";
import { ReactElement, JSXElementConstructor, useState } from "react";

import { useRouter } from "next/navigation";
import { useProModal } from "@/hooks/use-pro-model";
import toast from "react-hot-toast";



const VideoPage = () => {
    const router = useRouter();
    const proModal = useProModal();
    const [video, setvideo] = useState<string>();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setvideo(undefined);
            
            const response = await axios.post('/api/video', values);
            setvideo(response.data[0]);
            
            form.reset();
        } catch (error: any) {
            // TODO: Open Pro model
            if (error?.response?.status === 403) {
                proModal.onOpen();
            } else {
                toast.error("Something went wrong.")
            }
        } finally {
            router.refresh();
        }
    }

    return (
        <div>
            <Heading 
                title="Video Generation"
                description="Transform ideas into captivating videos, effortlessly and creatively."
                icon={VideoIcon}
                iconColor="text-orange-700"
                bgColor="bg-orange-700/10"
            />
            <div className="px-4 lg:px-8">
                <Form {...form}>
                    <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                    >
                        <FormField 
                        name="prompt"
                        render={({field}) => (
                            <FormItem className="col-span-12 lg:col-span-10">
                                <FormControl className="m-0 p-0">
                                    <Input 
                                    className="border-0 outlione-none focus-visible:ring-0 focus-visible:ring-transparent" 
                                    disabled={isLoading}
                                    placeholder="Clown fish swimming around a coral reef"
                                    {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                        />
                        <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                            Generate
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="space-y-4 mt-4">
                {isLoading && (
                    <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                        <Loader />
                    </div>
                )}
                {!video && !isLoading && (
                    <Empty label="No video generated."/>
                )}
                {video && (
                    <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black">
                        <source src={video} />
                    </video>
                )}
            </div>
        </div>
    );
}

export default VideoPage;