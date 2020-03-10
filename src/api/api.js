import axios from 'axios';


// let base = 'http://127.0.0.1:8080/myproject-questionnaire';    //本机路径
// let base = 'http://www.waixingren.online';    //服务器路径
let base = '/api/myproject-questionnaire';                           //测试路径

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const adminLogin = params => { return axios.post(`${base}/login`, params, {　headers:{'Content-Type':'application/x-www-form-urlencoded'}  }) };

/** 轮播图axios **/

export const getRounterChartAll = params => { return axios.get(`${base}/rounterchart/findAll.action`, { params: params }); };

export const removeRounterChart = params => { return axios.get(`${base}/rounterchart/delete.action`, { params: params }); };

export const editRounterChart = params => { return axios.post(`${base}/rounterchart/update.action`, params).then(res => res.data); };

export const addRounterChart = params => { return axios.post(`${base}/rounterchart/add.action`, params).then(res => res.data); };


/** 用户axios **/

export const getUserListPage = params => { return axios.get(`${base}/user/search.action`, { params: params }); };

export const addUser = params => { return axios.post(`${base}/user/add.action`, params).then(res => res.data); };

export const editUser = params => { return axios.post(`${base}/user/update.action`, params).then(res => res.data); };

export const removeUser = params => { return axios.get(`${base}/user/delete.action`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/delete.action`, { params: params }); };

export const changePassword = params => { return axios.post(`${base}/user/password.action`, params) };

/** 问卷axios **/

export const getNaireListPage = params => { return axios.get(`${base}/questionnaire/search.action`, { params: params }); };

export const getNaireList = params => { return axios.get(`${base}/questionnaire/findAll.action`, { params: params }); };


//=====
export const saveNaire = params => { return axios.post(`${base}/questionnaire/save.action`, params)  };

export const updateNaire = params => { return axios.post(`${base}/questionnaire/update.action`, params)  };

export const updateNaireStatue = params => { return axios.get(`${base}/questionnaire/updateStatus.action`, { params: params }); };

export const getNaire = params => { return axios.get(`${base}/questionnaire/get.action`, { params: params }); };

export const removeNaires = params => { return axios.get(`${base}/questionnaire/delete.action`, { params: params }); };

export const getNaireDetail = params => { return axios.get(`${base}/questionnaire/getDetail.action`, { params: params }); };

export const getNaireTotalDetail = params => { return axios.get(`${base}/questionnaire/getTotalDetail.action`, { params: params }); };

export const download = params => { return axios.post(`${base}/Upload/download.action`, { params: params, responseType:'blob'}); };

export const batchRemoveNaire = params => { return axios.get(`${base}/questionnaire/delete.action`, { params: params }); };




export const getNaireById = params => { return axios.get(`${base}/questionnaire/findOne.action`, { params: params }); };

export const getQuestionById = params => { return axios.get(`${base}/question/findOne.action`, { params: params }); };

export const getQuestions = params => { return axios.get(`${base}/question/findQuestions.action`, { params: params }); };

export const changeStatus = params => { return axios.post(`${base}/questionnaire/status.action`, params) };

export const addNaire = params => { return axios.post(`${base}/questionnaire/add.action`, params)  };

export const editNaire = params => { return axios.post(`${base}/questionnaire/update.action`, params)  }

export const removeNaire = params => { return axios.get(`${base}/questionnaire/delete.action`, { params: params }); };

export const getNaireNum = params => { return axios.get(`${base}/questionnaire/findAllNum.action`, { params: params }); };



/** 问题axios **/

export const addQuestion = params => { return axios.post(`${base}/question/add.action`, params)  };

export const editQuestion = params => { return axios.post(`${base}/question/update.action`, params)  };

export const removeQuestion = params => { return axios.get(`${base}/question/delete.action`, { params: params }); };

/** 选项axios **/

export const addOptions = params => { return axios.post(`${base}/options/add.action`, params)  };

export const editOptions = params => { return axios.post(`${base}/options/update.action`, params)  };

export const removeOptions = params => { return axios.get(`${base}/options/delete.action`, { params: params }); };

/** 答案axios **/

export const findUserNum = params => { return axios.get(`${base}/answer/findByNum.action`, { params: params }); };

export const findOptionsID = params => { return axios.get(`${base}/answer/findByOptionsID.action`, { params: params }); };

/** 消息axios **/

export const getMessageAll = params => { return axios.get(`${base}/message/findAll.action`, { params: params }); };

export const removeMessage = params => { return axios.get(`${base}/message/delete.action`, { params: params }); };

export const editMessage = params => { return axios.post(`${base}/message/update.action`, params).then(res => res.data); };

export const addMessage = params => { return axios.post(`${base}/message/add.action`, params).then(res => res.data); };



/** 上传文件axios **/

export const UpLoadImage = params => { return axios.post(`${base}/Upload/image.action`, { params: params }); };

export const UpLoadExcel = params => { return axios.post(`${base}/Upload/excel.action`, { params: params }); };

export const UpLoadWord = params => { return axios.get(`${base}/Upload/word.action`, { params: params, responseType:'blob'}); };
