import React, { forwardRef } from "react";

const Video = (props, ref) => {
    return <video 
        {...props} 
        webkit-playsinline="true"
        x5-playsinline="true"
        playsInline
        ref={ref}
    ></video>
}

export default forwardRef(Video)