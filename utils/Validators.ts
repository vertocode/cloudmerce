export const validateName = (name: string): boolean | string => {
    if (name?.length >= 2) return true

    return 'Name needs to be at least 2 characters.'
}

export const validateEmail = (email: string): boolean | string => {
    if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(email)) return true

    return 'Must be a valid e-mail.'
}

export const validatePassword = (password: string): boolean | string => {
    if (password?.length >= 8) return true

    return 'Password needs to be at least 8 characters.'
}

export const validatePasswordConfirmation = (password: string, confirmation: string): boolean | string => {
    if (password === confirmation) return true

    return 'Passwords do not match.'
}
