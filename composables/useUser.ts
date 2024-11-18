import {computed} from "vue";

interface AuthParams {
    email: string;
    password: string;
}

interface RegisterParams {
    name: string;
    email: string;
    password: string;
}

export type Role = 'user' | 'admin'

interface User {
    createdAt: string;
    email: string;
    name: string;
    role: Role
    password: string;
    _id: string;
}

export const useUser = () => {
    const storage = makeStorage()

    const userData = useState<User | null>('userData', () => null);
    const { get, post } = useApi();

    const isAdmin = computed(() => userData.value?.role === 'admin')

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
            return { code: 'success' }
        } catch (error) {
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
            const userResponse = response as User
            if (!userResponse?._id) {
                throw new Error('Response without user id');
            }
            userData.value = userResponse;
            storage.setItem('userData', userResponse);
            handleSuccess('Usuário cadastrado com sucesso!');
            return { code: 'success' };
        } catch (e) {
            handleError('Erro ao cadastrar usuário');
            return { code: 'error' }
        }
    };

    return {
        userData,
        isAdmin,
        login,
        logout,
        register,
    };
};
