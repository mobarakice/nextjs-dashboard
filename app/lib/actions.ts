'use server';
import { z } from 'zod';
import {deleteInvoiceById, saveInvoice} from "@/app/lib/data";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';



const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });


export async function createInvoice(formData: FormData) {
    const data = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    console.log(data);
    await saveInvoice("","POST",data.customerId, data.amount, data.status);
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
    const data = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const path = `/${id}`
    await saveInvoice(path,"PUT",data.customerId, data.amount, data.status);

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    // throw new Error('Failed to Delete Invoice');
    const path = `/${id}`
    await deleteInvoiceById(path,);
    revalidatePath('/dashboard/invoices');
}