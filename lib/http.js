// lib/http.js

// 通过 axios 处理请求
const axios = require('axios')

axios.interceptors.response.use(res => {
  return res.data;
})

const repos = [{
  name: 'monorepo-template',
  url: 'https://github.com/pzzyf/monorepo-template',
}, {
  name: 'vue-template',
  url: 'https://github.com/pzzyf/vue-template',
}, {
  name: 'react-template',
  url: 'https://github.com/pzzyf/react-template',
}, {
  name: 'ts-template',
  url: 'https://github.com/pzzyf/ts-template',
}
];

/**
 * 获取模板列表
 * @returns Promise
 */
async function getRepoList() {
  return Promise.resolve(repos);
}

module.exports = {
  getRepoList
}
