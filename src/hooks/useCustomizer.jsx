import { useState, useEffect } from "react";
import axios from 'axios'

const useCustomizer = () => {
    const [navColor, setNavColor] = useState('')

    const baseUrl = import.meta.env.VITE_WP_BASEURL;

    useEffect(() => {
        axios
            .get(`${baseUrl}wp-json/custom-theme/v1/customizer-settings`)
            .then((response) => {
                const { navbarColor } = response.data;             
                setNavColor(navbarColor)
            })
            .catch((error) => {
                console.error('error fetching customizer settings', error)
            });
    }, [baseUrl]);
    return {navColor}
 };

 export default useCustomizer;