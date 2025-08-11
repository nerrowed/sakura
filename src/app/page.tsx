'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { FirebaseError } from 'firebase/app';
import Image from 'next/image';
import sakuraIcon from './sakura.ico';

const formSchema = z.object({
  email: z.string().email({ message: 'Format email tidak valid.' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, role, loading, signUp, signIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Redirect user if already logged in
  useEffect(() => {
    if (!loading && user && role) {
       if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'petugas') {
        router.push('/petugas');
      } else {
        router.push('/nasabah');
      }
    }
  }, [user, role, loading, router]);


  const handleAuthError = (error: FirebaseError) => {
    let description = 'Terjadi kesalahan. Silakan coba lagi.';
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        description = 'Email atau password salah.';
        break;
      case 'auth/email-already-in-use':
        description = 'Email ini sudah terdaftar. Silakan login.';
        break;
      case 'auth/invalid-email':
        description = 'Format email tidak valid.';
        break;
      default:
        console.error(error.code, error.message);
        description = 'Terjadi kesalahan yang tidak diketahui.';
        break;
    }
    toast({
      variant: 'destructive',
      title: 'Autentikasi Gagal',
      description,
    });
  };

  const handleSignIn = async (values: FormValues) => {
    setIsLoading(true);
    try {
      await signIn(values.email, values.password);
      toast({ title: 'Login Berhasil', description: 'Selamat datang kembali! Mengarahkan...' });
      // The useEffect will handle the redirect
    } catch (error) {
      handleAuthError(error as FirebaseError);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (values: FormValues) => {
    setIsLoading(true);
    try {
      await signUp(values.email, values.password);
      toast({ title: 'Pendaftaran Berhasil', description: 'Akun Anda telah dibuat. Mengarahkan...' });
      // The useEffect will handle the redirect
    } catch (error) {
      handleAuthError(error as FirebaseError);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Display a loading indicator or null while checking auth state
  if (loading || user) {
     return (
       <div className="flex h-screen w-full items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Memeriksa sesi Anda...</p>
          </div>
       </div>
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Image src={sakuraIcon} alt="SakuraGo Logo" width={40} height={40} />
          </div>
          <CardTitle className="font-headline text-4xl font-bold text-primary">SakuraGo</CardTitle>
          <CardDescription className="pt-1">Sistem Digitalisasi Penjemputan Sampah</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Masuk</TabsTrigger>
              <TabsTrigger value="signup">Daftar</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4 pt-4">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="email@contoh.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" placeholder="******" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full font-bold" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Masuk
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="signup">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4 pt-4">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="email@contoh.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" placeholder="******" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <Button type="submit" className="w-full font-bold" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Daftar Akun Baru
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
       <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SakuraGo. All rights reserved.</p>
        </footer>
    </main>
  );
}
