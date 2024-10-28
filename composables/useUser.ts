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
            const response = await get('/auth/login', authParams);
            if (!response?._id) {
                throw new Error('Response without user id')
            }
            userData.value = response as User
            storage.setItem('userData', response)
            handleSuccess('Login efetuado com sucesso!')
            return { code:'success' }
        } catch (error) {
            handleError(error)
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
        } catch (e) {
            handleError(e);
        }
    };

    return {
        userData,
        login,
        logout,
        register,
    };
};
