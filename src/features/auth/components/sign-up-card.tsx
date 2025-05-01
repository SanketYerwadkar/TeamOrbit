'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { OAuthProvider } from 'node-appwrite';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { z } from 'zod';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRegister } from '@/features/auth/api/use-register';
import { signUpFormSchema } from '@/features/auth/schema';
import { onOAuth } from '@/lib/oauth';

export const SignUpCard = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { mutate: register, isPending: isRegistering } = useRegister();
  const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof signUpFormSchema>) => {
    register(
      {
        json: values,
      },
      {
        onSuccess: () => {
          signUpForm.reset();
        },
        onError: () => {
          signUpForm.resetField('password');
        },
      },
    );
  };

  const handleOAuth = (provider: OAuthProvider.Github | OAuthProvider.Google) => {
    setIsRedirecting(true);

    onOAuth(provider)
      .catch((error) => {
        console.error(error);
        toast.error('Something went wrong.');
      })
      .finally(() => setIsRedirecting(false));
  };

  const isPending = isRegistering || isRedirecting;

  return (
    <Card className="w-full max-w-xl md:w-[460px] rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl p-6">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        <CardTitle className="text-3xl text-white">Create an account</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...signUpForm}>
          <form onSubmit={signUpForm.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isPending}
              name="name"
              control={signUpForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Full name" className="bg-white" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isPending}
              name="email"
              control={signUpForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} className="bg-white" type="email" placeholder="Email address" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isPending}
              name="password"
              control={signUpForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} className="bg-white" type="password" placeholder="Password" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <CardDescription>
              By signing up, you agree to{' '}
              <Link href="#">
                <span className="text-blue-700">Privacy Policy</span>
              </Link>{' '}
              and{' '}
              <Link href="#">
                <span className="text-blue-700">Terms of Service</span>
              </Link>
            </CardDescription>

            <Button type="submit" disabled={isPending} size="lg" className="w-full ">
              Register
            </Button>
          </form>
        </Form>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="flex flex-col gap-y-4 p-7">
        <Button onClick={() => handleOAuth(OAuthProvider.Google)} disabled={isPending} variant="secondary" size="lg" className="w-full">
          <FcGoogle className="mr-2 size-5" /> Continue with Google
        </Button>

        <Button onClick={() => handleOAuth(OAuthProvider.Github)} disabled={isPending} variant="secondary" size="lg" className="w-full">
          <FaGithub className="mr-2 size-5" /> Continue with GitHub
        </Button>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="flex items-center justify-center p-7">
        <p>
          Already have an account?{' '}
          <Link href="/sign-in">
            <span className="text-blue-700">Login</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
