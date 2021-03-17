import { observable } from 'mobx'

class orderStore {
    @observable USER_TOKEN = '';
    @observable USER_LOGIN = {};
    @observable SCHOOL = {};
    @observable PROFESSOR={};
    @observable SCHOOLS_LIST=[];
    @observable PROFESSORS_LIST=[];
    @observable professorData = false; 
}

const store = new orderStore();

export default store;
