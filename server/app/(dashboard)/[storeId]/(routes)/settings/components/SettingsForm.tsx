"use client";

import {Store} from "@prisma/client";
import React from "react";
import {Heading} from "@/components/ui/Heading";
import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

interface SettingsFormProps {
    initialData: Store;
}

const formSchema = z.object({name: z.string().min(1),});

type SettingsFormValues = z.infer<typeof formSchema>

export const SettingsForm: React.FC<SettingsFormProps> = ({initialData}) => {
    const form = useForm<SettingsFormValues>({resolver: zodResolver(formSchema), defaultValues: initialData})
    const onSubmit = async (data: SettingsFormValues) => {
        console.log(data);
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title="Settings" description="Manage store"/>
                <Button variant="destructive" size="sm" onClick={() => {
                }}>
                    <Trash className="h-4 w-4"/>
                </Button>
            </div>
            <Separator/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({field})=>(
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading}/>
                                </FormControl>
                            </FormItem>
                        )}/>
                    </div>
                </form>
            </Form>
        </>
    )
}