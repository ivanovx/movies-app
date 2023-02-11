import React from "react";
import axios from "axios";

import config from '../../config';
import store from '../../hooks/store';

export const ElasticContext = React.createContext({
    token: null
});

export const useElastic = () => React.useContext(ElasticContext);

export default function ElasticProvider({ children }) {
    const [token, setToken] = React.useState(store.get('token', null));

    React.useEffect(() => {
        const controller = new AbortController();
        
        axios.post(`${config.ELASTIC_HOST}/_security/oauth2/token`, {
            "grant_type" : "password",
            "username" : config.ELASTIC_USER,
            "password" : config.ELASTIC_PASSWORD
          }, {
            signal: controller.signal,
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

        return () => controller.abort();
    }, []);

    React.useEffect(() => {
        store.set('token', token);
    }, [token]);

    return <ElasticContext.Provider value={{token}}>{children}</ElasticContext.Provider>;
}