import Cookies from 'js-cookie';

export const GetTokenCookie = (cookie: string) => {
    return Cookies.get(cookie) || null;
};

export const SetTokenCookie = (cookie: string, token: string, days: number) => {
    // expires: número de días antes de que la cookie expire
    // secure: establece la cookie como segura, solo se enviará a través de conexiones HTTPS
    // sameSite Lax: ayuda a proteger contra ciertos tipos de ataques CSRF (Cross-Site Request Forgery)
    Cookies.set(cookie, token, { expires: days, secure: true, sameSite: 'Lax' });
};

export const RemoveTokenCookie = (cookie: string) => {
    Cookies.remove(cookie);
};