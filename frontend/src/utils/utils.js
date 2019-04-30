import Cookies from "universal-cookie";

export function getURLParamVal(paramKey) {
  const url = window.location.href;
  return new URL(url).searchParams.get(paramKey);
}

export function setNextAndCurrPathCookies(nextPath) {
  const cookies = new Cookies();
  cookies.set('next_path', nextPath, { path: '/spotifyCallback' });
  cookies.set('from_path', window.location.pathname, { path: '/spotifyCallback' });
}

export function generateStateParamCookie() {
  const cookies = new Cookies();
  const state = Math.random().toString(36).substring(2, 15);
  cookies.set('state_param', state, { path: '/spotifyCallback' });
  return state;
}