'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useContext, useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { LayoutContext } from '../../../layout/context/layoutcontext';

const LandingPage = () => {
    
    return (
    <div>
        <div className="landing-page">
            <div className="landing-page-header">
                <div className="landing-page-header-content">
                    <h1>PrimeReact</h1>
                    <p>PrimeReact is a rich set of open source UI Components for React.</p>
                    <div className="p-d-flex p-jc-center">
                        <Button label="Get Started" icon="pi pi-play" className="p-button-rounded p-button-text" />
                    </div>
                </div>
            </div>

            <div className="landing-page-content">
                <div className="landing-page-content-left">
                    <h2>Features</h2>
                    <ul>
                        <li>50+ Components</li>
                        <li>Free and Open Source</li>
                        <li>Themes and Templates</li>
                        <li>PrimeFlex Grid CSS</li>
                        <li>Productivity Tools</li>
                        <li>Mobile Optimized</li>
                        <li>Professional Support</li>
                    </ul>
                </div>
                <div className="landing-page-content-right">
                    <h2>Get Started</h2>
                    <p>PrimeReact is a rich set of open source UI Components for React.</p>
                    <div className="p-d-flex p-jc-center">
                        <Button label="Download" icon="pi pi-download" className="p-button-rounded p-button-text" />
                    </div>
                </div>
            </div>
        </div>
    </div>);
};

export default LandingPage;
