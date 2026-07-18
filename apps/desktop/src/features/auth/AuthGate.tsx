import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  authLoginPayloadSchema,
  authSignupPayloadSchema,
  type AuthLoginPayload,
  type AuthSignupPayload,
} from '@lifequest/schemas';
import { useJourneyStore } from '@/store/journeyStore';
import { useUserQuery } from '@/hooks/useUserQuery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient, isDemoMode } from '@/lib/apiClient';

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const session = useJourneyStore((state) => state.session);
  const user = useJourneyStore((state) => state.user);
  const clearSession = useJourneyStore((state) => state.clearSession);
  const { isLoading } = useUserQuery();

  if (!session) {
    return <AuthScreen onAuthenticated={() => {}} />;
  }

  if (isLoading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 text-muted-foreground">
        <p>Syncing your LifeQuest data…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted/30 text-center">
        <p className="text-lg font-medium text-muted-foreground">Your session expired. Please sign in again.</p>
        <Button onClick={clearSession}>Back to login</Button>
      </div>
    );
  }

  return <>{children}</>;
};

const AuthScreen = ({ onAuthenticated }: { onAuthenticated: () => void }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const setAuthPayload = useJourneyStore((state) => state.setAuthPayload);
  const [error, setError] = useState<string | null>(null);
  const isLogin = mode === 'login';

  const loginForm = useForm<AuthLoginPayload>({
    resolver: zodResolver(authLoginPayloadSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<AuthSignupPayload>({
    resolver: zodResolver(authSignupPayloadSchema),
    defaultValues: { name: '', email: '', password: '', audience: 'LAID_OFF' },
  });

  const handleLogin = async (values: AuthLoginPayload) => {
    setError(null);
    const response = await apiClient.auth.login(values);
    setAuthPayload(response);
    onAuthenticated();
  };

  const enterDemo = async () => {
    setError(null);
    try {
      // Real demo credentials — accepted by the live backend, and (since
      // demo mode accepts anything) by the in-browser client too.
      const response = await apiClient.auth.login({
        email: 'demo@lifequest.app',
        password: 'LifeQuest123!',
      });
      setAuthPayload(response);
      onAuthenticated();
    } catch {
      setError('Unable to start the demo');
    }
  };

  const handleSignup = async (values: AuthSignupPayload) => {
    setError(null);
    const response = await apiClient.auth.signup(values);
    setAuthPayload(response);
    onAuthenticated();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardDescription className="uppercase tracking-[0.4em] text-muted-foreground">
            LifeQuest Desktop
          </CardDescription>
          <CardTitle>{isLogin ? 'Sign in to continue' : 'Create your account'}</CardTitle>
          <p className="text-sm text-muted-foreground">
            One account works across desktop, future web, and mobile experiences.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 border-b border-border pb-4">
            <Button type="button" className="w-full" onClick={enterDemo}>
              Enter the demo →
            </Button>
            <p className="text-center font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground">
              {isDemoMode
                ? 'Runs entirely in your browser · no account, nothing leaves the page'
                : 'Signs you in as the demo account · no signup needed'}
            </p>
          </div>
          {isLogin ? (
            <form
              className="space-y-3"
              onSubmit={loginForm.handleSubmit(async (values) => {
                try {
                  await handleLogin(values);
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Unable to sign in');
                }
              })}
            >
              <AuthInput label="Email" type="email" {...loginForm.register('email')} />
              <AuthInput label="Password" type="password" {...loginForm.register('password')} />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
          ) : (
            <form
              className="space-y-3"
              onSubmit={signupForm.handleSubmit(async (values) => {
                try {
                  await handleSignup(values);
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Unable to create account');
                }
              })}
            >
              <AuthInput label="Name" {...signupForm.register('name')} />
              <AuthInput label="Email" type="email" {...signupForm.register('email')} />
              <AuthInput label="Password" type="password" {...signupForm.register('password')} />
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Focus audience</label>
                <select
                  {...signupForm.register('audience')}
                  className="w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="LAID_OFF">Career transition</option>
                  <option value="RETIRED">New chapter</option>
                </select>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                Create account
              </Button>
            </form>
          )}
          <Button variant="ghost" className="w-full" onClick={() => setMode(isLogin ? 'signup' : 'login')}>
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const AuthInput = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <label className="block text-sm font-medium text-muted-foreground">
    {label}
    <input
      className="mt-1 w-full rounded-md border bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
      {...props}
    />
  </label>
);

export const useLogout = () => {
  const clearSession = useJourneyStore((state) => state.clearSession);

  return async () => {
    try {
      await apiClient.auth.logout();
    } catch {
      // ignore
    }
    clearSession();
  };
};
