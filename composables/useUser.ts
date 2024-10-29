interface AuthParams {
    email: string;
    password: string;
}

interface RegisterParams {
    name: string;
    email: string;
    password: string;
}

interface User {
    createdAt: string;
    email: string;
    name: string;
    password: string;
    _id: string;
}

export const useUser = () => {
    const storage = makeStorage()

    const userData = useState<User | null>('userData', () => null);
    const { get, post } = useApi();

    onMounted(() => {
        if (process.client) {
            userData.value = storage.getItem<User>('userData');
        }
    })

    const login = async (authParams: AuthParams) => {
        try {
            const response = await get('/auth/login', authParams) as User | { errorCode: string }

            if ((response as { errorCode: string })?.errorCode === 'user_not_found') {
                handleWarning('Usuário não encontrado')
                return { code: 'user_not_found' }
            }

            if (!(response as User)?._id) {
                throw new Error('Response without user id')
            }
            userData.value = response as User
            storage.setItem('userData', response)
            handleSuccess('Login efetuado com sucesso!')
            return { code: 'success' }
        } catch (error) {
            console.log(error)
            handleError('Erro ao efetuar login')
            return { code: 'error' }
        }
    };

    const logout = () => {
        userData.value = null;
        storage.removeItem('userData');
    };

    const register = async (registerParams: RegisterParams) => {
        try {
            const response = await post('/users', registerParams);
            if (!response?._id) {
                throw new Error('Response without user id');
            }
            userData.value = response as User;
            storage.setItem('userData', response);
            handleSuccess('Usuário cadastrado com sucesso!');
            return { code: 'success' };
        } catch (e) {
            handleError('Erro ao cadastrar usuário');
            return { code: 'error' }
        }
    };

    return {
        userData,
        login,
        logout,
        register,
    };
};
