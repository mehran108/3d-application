import React from 'react';

const RoomJSX = () =>{
    return (
        <div className="canvas-wrapper">
            <div className="loading" id="js-loader">
                <div className="loader"></div>
            </div>
            <div className="options"> 
            <div className="option --is-active" data-option="Outer_Wall">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/legs.svg" alt="" />
            </div>
            <div className="option" data-option="Inner_Room_Wall">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/cushions.svg" alt="" />
            </div>
            <div className="option" data-option="Floor">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/base.svg" alt="" />
            </div>
            {/* <div className="option" data-option="supports">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/supports.svg" alt="" />
            </div> */}
            {/* <div className="option" data-option="back">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/back.svg" alt="" />
            </div> */}
            </div> 
            <canvas id="c"></canvas>
            <div className="controls">
                <div className="info">
                    <div className="info__message">
                        <p><strong>&nbsp;Grab&nbsp;</strong> to rotate. <strong>&nbsp;Scroll&nbsp;</strong> to zoom. <strong>&nbsp;Drag&nbsp;</strong> swatches to view more.</p>
                    </div>
                </div>
                <div id="js-tray" className="tray">
                    <div id="js-tray-slide" className="tray__slide"></div>
                </div>
            </div> 
        </div>
    );
}

export default RoomJSX;