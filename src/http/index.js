import serviceAxios from "./axios"

export function get(url, params) {
  return new Promise((resolve, reject) => {
    serviceAxios.get(url, {
      params: params
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export function post(url, data) {
  return new Promise((resolve, reject) => {
    serviceAxios.post(url, data)
      .then(res => {
        resolve(res);
      }).catch(err => {
        reject(err)
      })
  })
}