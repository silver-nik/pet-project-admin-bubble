import { Component } from "react";
import axios from "axios";

export default function authService() {
    const checkAuth = () => {
        axios
            .get('./api/checkAuth.php')
            .then(res => {
                console.log(res.data.role);
            })
    }

    const checkToken = (callback) => {
        const token = localStorage.getItem('token');  
        
        axios
            .get('./api/checkValid.php', {
                headers: { au: `Bearer ${token}` }
            })
            .then(data => {
                if (data.data.auth) {

                    const {auth, role, colours, theme, user_id, name} = data.data;

                    callback(
                        auth, 
                        role, 
                        colours, 
                        theme, 
                        user_id, 
                        name
                    );
                }
            })
            .catch((err) => console.log(err))

    }

    const checkValid = () => {

        const token = localStorage.getItem('token');  

        return axios
            .get('./api/checkValid.php', {
                headers: { au: `Bearer ${token}` }
            })
    }

    return { checkAuth, checkToken, checkValid };
}