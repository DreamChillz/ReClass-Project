import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/images/ReClass Logo.png" // <- public/images/logo-dark.png
            alt="App Logo"
        />
    );
}
