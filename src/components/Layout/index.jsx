import React from "react";
import axios from "axios";

import config from '../../config';

export default function Layout({ children }) {
    const [token, setToken] = React.useState("");

    React.useEffect(() => {
        axios.post(`${config.ELASTIC_HOST}/_security/oauth2/token`, {
            "grant_type" : "password",
            "username" : config.ELASTIC_USER,
            "password" : config.ELASTIC_PASSWORD
          }, {
            auth: {
                username: config.ELASTIC_USER,
                password: config.ELASTIC_PASSWORD
            }
        }).then(res => {
            const { access_token } = res.data;
            setToken(access_token);
        }).catch(err => {
            console.log(err);
        });
        return () => {};
    }, []);

    React.useEffect(() => {
        window.localStorage.setItem("token", token);
    }, [token]);

    return (<div className="layout">{children}</div>);
}