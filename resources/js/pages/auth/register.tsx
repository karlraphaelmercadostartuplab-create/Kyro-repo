import InputError from '@/components/ui/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Register() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <AuthLayout
            title={t('Create an account')}
            description={t('Enter your details below to create your account')}
        >
            <Head title={t('Register')} />
            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-white">{t('Name')}</Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            maxLength={27}
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            placeholder={t('Full name')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none transition-colors placeholder-gray-400 dark:bg-slate-700 dark:text-white"
                        />
                        <InputError
                            message={errors.name}
                            className="mt-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-white">{t('Email address')}</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            tabIndex={2}
                            autoComplete="email"
                            placeholder="email@example.com"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none transition-colors placeholder-gray-400 dark:bg-slate-700 dark:text-white"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-900 dark:text-white">{t('Password')}</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                placeholder={t('Password')}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none transition-colors placeholder-gray-400 dark:bg-slate-700 dark:text-white"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-0 h-full px-3"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-900 dark:text-white">
                            {t('Confirm password')}
                        </Label>
                        <div className="relative">
                            <Input
                                id="password_confirmation"
                                type={showPasswordConfirmation ? 'text' : 'password'}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                placeholder={t('Confirm password')}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none transition-colors placeholder-gray-400 dark:bg-slate-700 dark:text-white"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                className="absolute right-0 top-0 h-full px-3"
                                tabIndex={-1}
                            >
                                {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        <InputError
                            message={errors.password_confirmation}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary text-white py-2.5 text-sm font-medium tracking-wide transition-all duration-200 rounded-md shadow-md hover:shadow-lg transform hover:scale-[1.02] mt-6"
                        tabIndex={5}
                        disabled={processing}
                        data-test="register-user-button"
                    >
                        {processing ? 'Loading...' : t('CREATE ACCOUNT')}
                    </Button>
                </div>

                <div className="text-center mt-5">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('Already have an account?')}{' '}
                        <Link href={route('login')} tabIndex={6} className="text-primary font-medium hover:underline">
                            {t('Log in')}
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
