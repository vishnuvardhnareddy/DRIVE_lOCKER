import React from 'react';

const Loader = () => {
    return (
        <div className="flex flex-grow items-center justify-center w-full h-full">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/30 border-t-[#e50914]"></div>
        </div>
    );
};

export default Loader;