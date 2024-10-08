'use client'
import app from "@/services/cms";

const TOKEN_COOKIE_NAME = "user-token"
const TOKEN_PROFILE_NAME = "user-profile"
export async function login(email: string, password: string): Promise<void> {
    return app.login(email, password).then((data) => {
        setCookie(TOKEN_COOKIE_NAME, data.token)
        setCookie(TOKEN_PROFILE_NAME, JSON.stringify(data.profile))
    })
}

export async function forgotPassword(email: string): Promise<void> {
    return app.forgotPassword(email)
}

export async function resetPassword(email: string, code: string, password: string): Promise<void> {
    return app.resetPassword(email, code, password)
}

export function isLoggedIn() {
    return getCookie(TOKEN_COOKIE_NAME)
}

export function getToken():string {
    const userData = getCookie(TOKEN_COOKIE_NAME)
    //const data = JSON.parse(userData??"{}")
    
    return userData ?? ""
}

export function getProfile():any {
    const userData = getCookie(TOKEN_PROFILE_NAME)
    const data = JSON.parse(userData??"{}")
    
    return data
}

export function logout(output: Output<void>) {
    deleteCookie(TOKEN_COOKIE_NAME)
    output.onSuccess()
}

export function setCookie(name: string, val: string) {
    const date = new Date();
    const value = val;

    // Set it expire in 7 days
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));

    // Set it
    document.cookie = name+"="+value+"; expires="+date.toUTCString()+"; path=/";
}

export function getCookie(name: string) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    
    if (parts.length == 2) {
        return parts.pop()?.split(";").shift();
    }
}

export function deleteCookie(name: string) {
    const date = new Date();

    // Set it expire in -1 days
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

    // Set it
    document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
}