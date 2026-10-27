import { redirect } from 'next/navigation';
import { auth } from "@/lib/auth";

import Navbar from '@/components/navbar'
import prismadb from '@/lib/prismadb';

export default async function DashboardLayout({
  children,
  params: paramsPromise
}: {
  children: React.ReactNode
  params: Promise<{ storeId: string }>
}) {
  const params = await paramsPromise;
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({ 
    where: {
      id: params.storeId,
      userId,
    }
   });

  if (!store) {
    redirect('/');
  };

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
