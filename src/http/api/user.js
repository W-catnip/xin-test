import { get, post } from '../index';

export const signUp = userData => {
  return post('/user/signUp', userData)
}

export const signIn = userData => {
  return post('/user/signIn', userData).then((res) => {
    window.localStorage.setItem('token', res.data.conditionData);
    window.localStorage.setItem('username', userData.username);
    return Promise.resolve(res);
  })
}

export const verify = () => {
  return get('/verify')
}