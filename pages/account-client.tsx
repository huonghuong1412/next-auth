import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const AccountClient = () => {
    const router = useRouter();
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push(`/dangnhap?callbackUrl=${router.asPath}`)
        },
    });

    if (status === 'loading') {
        return <h1>Loading...</h1>
    }

    // if (status === 'unauthenticated') {
    //     return <h1>Unauthenticated</h1>
    // }

    return (
        <>
            <div>{session?.user?.email}</div>
            <div>{session?.user?.name}</div>
        </>
    )
}

export default AccountClient;