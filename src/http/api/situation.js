import { get, post } from '../index';

export const getSituations = params => {
  get('situation/get', params)
}

export const postSituations = data => {
  post('situation/post', data)
}