import React from 'react';

const OverlayLoading = () => {
    return (
        <div className="overlay">
            <div className="spinner"></div>
            <p className="loading-text">Đang tải...</p>
        </div>
    );
};

export default OverlayLoading;
