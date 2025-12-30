import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: false,
  model: {},
  initialState: {},
  request: {},
  layout: false,
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    }
  ],
  npmClient: 'npm',
});

