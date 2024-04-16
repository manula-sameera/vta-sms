/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';
import Link from 'next/link';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Logo" height="20" className="mr-2" />
            <p>
            &copy; <Link href="https://github.com/manula-sameera" target='_blank'><span className="font-medium ml-2">Manula Sameera</span></Link> 2024
            </p>
        </div>
    );
};

export default AppFooter;
