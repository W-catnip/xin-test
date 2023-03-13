import { get, post } from '../index';

export const getItem = store => {
  const params = {
    subject: store.subject,
    type: store.type,
    itemId: store.itemId,
    sort: store.sort,
    pagenum: store.pagenum,
    pagesize: store.pagesize
  }
  if (params.sort !== 'normal') {
    params.itemId = undefined;
  }
  return get('/items/get', params).then((res) => {
    // 获取后台题目数据后将store内的数据更新
    store.itemData = res.data.data;
    store.itemData.forEach((element) => {
      element.index = element.id;
    })
    store.total = res.data.other['count(*)'];
    store.type = res.data.data[0].type == 'C1,C2,C3' ? 'C1' : 'A1';
    return Promise.resolve(res.data);
  })
};

export const getExam = store => {
  const params = {
    subject: store.subject,
    type: store.type
  }
  return get('/items/exam', params).then((res) => {
    store.examData = res.data.data.reduce((sum, value) => {
      return sum.concat(value)
    }, [])
    return Promise.resolve(res.data);
  })
}

// 获取错题集存储
export const getError = store => {
  const params = {
    subjectDetails: store.subjectDetails,
    username: store.username
  }
  return get('/items/error/get', params).then((res) => {
    let data = res.data.data[0][params.subjectDetails];
    data = JSON.parse(data);
    store.errorData = data || [];
    return Promise.resolve(data);
  })
}

// 添加错题
export const updateError = body => {
  return post('/items/error/update', body)
}

// 删除错题
export const deleteError = body => {
  return post('/items/error/delete', body)
}