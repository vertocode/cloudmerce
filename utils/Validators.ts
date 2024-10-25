export const validateName = (name: string): boolean | string => {
    if (name?.length >= 2) return true

    return 'O nome precisa ter pelo menos 2 caracteres.'
}

export const validateEmail = (email: string): boolean | string => {
    if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(email)) return true

    return 'O e-mail precisa ser válido.'
}

export const validatePassword = (password: string): boolean | string => {
    if (password?.length >= 8) return true

    return 'A senha precisa ter pelo menos 8 caracteres.'
}

export const validatePasswordConfirmation = (password: string, confirmation: string): boolean | string => {
    if (password === confirmation) return true

    return 'As senhas não correspondem.'
}
