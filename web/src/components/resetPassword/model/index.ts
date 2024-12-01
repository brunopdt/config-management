export type AdminResetPasswordModel = {
    email: string
    code: string;
    newPassword: string;
}