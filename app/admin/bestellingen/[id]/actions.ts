'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/server';
import { sendShippingNotification } from '@/lib/email';

export async function markAsShipped(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return;

  const supabase = createServiceClient();
  const { data: order } = await supabase.from('orders').select('*').eq('id', id).single();
  if (!order) return;

  // Alleen versturen als de bestelling nog niet verzonden/afgeleverd is.
  if (order.status === 'shipped' || order.status === 'delivered') return;

  await supabase.from('orders').update({ status: 'shipped' }).eq('id', id);

  try {
    await sendShippingNotification({ ...order, status: 'shipped' });
  } catch (e) {
    console.error('Shipping email', e);
  }

  revalidatePath(`/admin/bestellingen/${id}`);
}
