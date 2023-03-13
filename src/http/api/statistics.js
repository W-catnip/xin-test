import { get, post } from '../index';

// 更新答题统计
export const updateItemStat = body => {
  return post('/statistics/update', body);
}

// 清空答题统计
export const clearItemStat = body => {
  return post('/statistics/clear', body);
}

// 获取答题统计
export const getItemStat = params => {
  return get('/statistics/get', params)
}

// 添加考试成绩
export const addExamStat = body => {
  return post('/statistics/addScores', body)
}

// 删除考试成绩
export const clearExamStat = body => {
  return post('/statistics/clearScores', body)
}

// 获得考试成绩
export const getExamStat = params => {
  return get('/statistics/getScores', params);
}