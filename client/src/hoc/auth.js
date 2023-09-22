import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../_actions/user_actions';

// eslint-disable-next-line import/no-anonymous-default-export
export default function (SpecificComponent, option, adminRoute = null) {

    //null    =>  아무나 출입이 가능한 페이지
    //true    =>  로그인한 유저만 출입이 가능한 페이지
    //false   =>  로그인한 유저는 출입 불가능한 페이지
    function AuthenticationCheck(props) {
        const dispatch = useDispatch();
        const navigate = useNavigate();

        useEffect(() => {

            dispatch(auth()).then(response => {
                console.log(response)
                if (!response.payload.isAuth) {
                    // 로그인 하지 않은 상태 
                        // 로그인 X 진입가능!
                    console.log("로그인 안한 상태1!!!");
                        // 로그인 X 진입불가능!
                    if (option) {
                        navigate('/login')
                        console.log("로그인 안한 상태2!!!");
                    }
                } else {
                    // 로그인 한 상태 
                    // adminRoute(관리자만 들어갈 수 있는 페이지)가 true이고, 관리자가 아닐 때
                    if (adminRoute && !response.payload.isAdmin) {
                        navigate('/')
                        console.log("로그인 한 상태1!!!");
                    } else {
                        // 로그인 O 진입불가능!
                        if (option === false) {
                            // props.history.push('/')
                            navigate('/')
                            console.log("로그인 한 상태2!!!");
                        }

                    }
                }
            })
        }, [])

        return (
            <SpecificComponent />
        )
    }
    return AuthenticationCheck
}