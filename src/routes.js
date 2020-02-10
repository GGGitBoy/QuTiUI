import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

import userList from './views/user/userList.vue'

import rounterChartList from './views/rounterChart/rounterChartList.vue'

import questionnaire1  from './views/questionNaire/questionnaire-1.vue'
import questionnaire2  from './views/questionNaire/questionnaire-2.vue'
import questionnaire3  from './views/questionNaire/questionnaire-3.vue'
import questionnaire4  from './views/questionNaire/questionnaire-4.vue'
import test  from './views/questionNaire/test.vue'
import demo  from './views/questionNaire/demo.vue'

import List  from './views/components/List.vue'
import Fill  from './views/components/Fill.vue'
import Edit  from './views/components/Edit.vue'
import Data  from './views/components/Data.vue'
import Datepicker  from './views/components/Datepicker.vue'

let routes = [
    {
        path: '/login',
        component: demo,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '导航一',
    //     iconCls: 'el-icon-message',//图标样式class
    //     children: [
    //         { path: '/main', component: Main, name: '主页', hidden: true },
    //         { path: '/table', component: Table, name: 'Table' },
    //         { path: '/form', component: Form, name: 'Form' },
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '导航二',
    //     iconCls: 'fa fa-id-card-o',
    //     children: [
    //         { path: '/page4', component: Page4, name: '页面4' },
    //         { path: '/page5', component: Page5, name: '页面5' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '',
    //     iconCls: 'fa fa-address-card',
    //     leaf: true,//只有一个节点
    //     children: [
    //         { path: '/page6', component: Page6, name: '导航三' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: 'Charts',
    //     iconCls: 'fa fa-bar-chart',
    //     children: [
    //         { path: '/echarts', component: echarts, name: 'echarts' }
    //     ]
    // },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'el-icon-user',
        children: [
            // { path: '/userText', component: userText, name: '用户列表' },
            { path: '/userList', component: userList, name: '用户列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '问卷管理',
        iconCls: 'el-icon-tickets',
        children: [
                    { path: '/questionNaire-1', component: questionnaire1, name: '问卷草稿箱' },
                    { path: '/questionNaire-2', component: questionnaire2, name: '已发布问卷' },
                    { path: '/questionNaire-3', component: questionnaire3, name: '已截止问卷' },
                    { path: '/questionNaire-4', component: questionnaire4, name: '作废问卷' },
                    { path: '/test', component: test, name: '测试页面' },
                    { path: '/List', component: List, name: '问卷页面' },
                    {  path: '/fill/:id',name: 'Fill',component: Fill, hidden: true },
                    {  path: '/data/:id',name: 'Data',component: Data, hidden: true },
                    {  path: '/edit/:id',name: 'Edit',component: Edit, hidden: true },
                    {  path: '/datepicker/:id',name: 'Datepicker',component: Datepicker, hidden: true },
                  
                  
                ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'el-icon-c-scale-to-original',
        leaf: true,//只有一个节点
        children: [
            { path: '/rounterchart', component: rounterChartList, name: '轮播图管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'echarts管理',
        iconCls: 'el-icon-bell',
        children: [
            { path: '/echarts', component: echarts, name: '系统消息' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;