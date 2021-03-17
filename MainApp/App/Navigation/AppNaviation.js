import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';1
import Home from '../Containers/MainFlow/home';
import Splash from '../Containers/Splash';
import FindProfessor from '../Containers/MainFlow/Professor/find_professor';
import FindSchool from '../Containers/MainFlow/School/find_school';
import SchoolList from '../Containers/MainFlow/School/school_list';
import SchoolDetail from '../Containers/MainFlow/School/school_detail';
import ProfessorsList from '../Containers/MainFlow/Professor/professors_list';
import ProfessorDetail from '../Containers/MainFlow/Professor/professor_detail';
import Login from '../Containers/LoginFlow/login';
import SignUp from '../Containers/MainFlow/signup';
import StudyData from '../Containers/MainFlow/Professor/professor_study_data';
import Profile from '../Containers/MainFlow/Profile';
import MyDocument from '../Containers/MainFlow/Profile/my_Documents'
import Pdf_View from '../Containers/MainFlow/pdf_view';
import EditProfile from '../Containers/MainFlow/Profile/editProfile';

const AppNavigator=createStackNavigator({
    splash:{
     screen:Splash
    },
    login:{
      screen:Login
    },
    signup:{
        screen:SignUp
    },
    home:{
        screen:Home
    },
    profile:{
        screen:Profile
    },
    editProfile:{
        screen:EditProfile
    },
    myDocuments:{
        screen:MyDocument
    },
    findSchool:{
        screen: FindSchool
    },
    findProfessor:{
        screen:FindProfessor
    },
    schoolList:{
        screen:SchoolList
    },
    schoolDetails:{
        screen:SchoolDetail
    },
    professorsList:{
        screen:ProfessorsList
    },
    professorDetail:{
        screen:ProfessorDetail
    },
    studyData:{
        screen:StudyData
    },
    pdfView:{
        screen:Pdf_View
    },
    
    
},
{
    initialRouteName:'splash',
}) 

export default createAppContainer(AppNavigator);
