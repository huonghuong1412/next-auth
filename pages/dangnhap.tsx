import React, { useState } from 'react'
import Link from 'next/link';
import { getCsrfToken, getSession, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface User {
    phone: string,
    password: string
}

const Dangnhap = ({ csrfToken }: any) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [error, setError] = useState<string>('');

    if (status === 'loading') {
        return <h1>Loading...</h1>
    }

    return (
        <div>
            <div className="page">
                <div style={{ marginBottom: 20 }}>
                    <Formik
                        initialValues={{ phone: '', password: '' }}
                        validationSchema={Yup.object({
                            phone: Yup.string()
                                .required('Please enter your phone'),
                            password: Yup.string().required('Please enter your password'),
                        })}
                        onSubmit={async (values, { setSubmitting }) => {
                            const res = await signIn('credentials', {
                                redirect: false,
                                phone: values.phone,
                                password: values.password,
                                callbackUrl: `${window.location.origin}`,
                            });
                            if (res?.error) {
                                console.log(res)
                                setError(res.error);
                            } else {
                                setError('');
                            }
                            if (res?.url) router.push(res.url);
                            setSubmitting(false);
                        }}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit}>
                                <div
                                    className="bg-red-400 flex flex-col items-center justify-center min-h-screen py-2 shadow-lg">
                                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                        <input
                                            name="csrfToken"
                                            type="hidden"
                                            defaultValue={csrfToken}
                                        />
                                        <div className="text-red-400 text-md text-center rounded p-2">
                                            {error}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="phone" className="uppercase text-sm text-gray-600 font-bold" >
                                                Phone
                                                <Field
                                                    name="phone"
                                                    aria-label="enter your email"
                                                    aria-required="true"
                                                    type="text"
                                                    className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                                                />
                                            </label>
                                            <div className="text-red-600 text-sm">
                                                <ErrorMessage name="email" />
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <label htmlFor="password" className="uppercase text-sm text-gray-600 font-bold">
                                                password
                                                <Field
                                                    name="password"
                                                    aria-label="enter your password"
                                                    aria-required="true"
                                                    type="password"
                                                    className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                                                />
                                            </label>

                                            <div className="text-red-600 text-sm">
                                                <ErrorMessage name="password" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <button
                                                type="submit"
                                                className="bg-green-400 text-gray-100 p-3 rounded-lg w-full"
                                            >
                                                {formik.isSubmitting ? 'Please wait...' : 'Sign In'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </Formik>
                    <button onClick={() => signIn('credentials', { callbackUrl: router.query.callbackUrl?.toString() })}>Login</button>
                </div>
                <button onClick={() => signIn('google', { callbackUrl: router.query.callbackUrl?.toString() })}>Sign In Google</button>
                <button onClick={() => signIn('facebook', { callbackUrl: router.query.callbackUrl?.toString() })}>Sign In Facebook</button>
                <button onClick={() => signIn('twitter', { callbackUrl: router.query.callbackUrl?.toString() })}>Sign In Twitter</button>
            </div>
            <div>
                <Link href="/">
                    <a>Home</a>
                </Link>
            </div>
        </div>
    )
}

export const getServerSideProps = async (context: any) => {
    const session = await getSession(context);
    if (session) {
        return {
            redirect: {
                destination: '/'
            }
        }
    }
    return {
        props: { session, csrfToken: await getCsrfToken(context), }
    }
}

export default Dangnhap;