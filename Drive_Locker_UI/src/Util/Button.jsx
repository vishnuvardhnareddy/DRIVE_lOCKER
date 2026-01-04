import React from 'react';

const CustomButton = ({ handleOnclick, text }) => {
    return (
        <button
            onClick={handleOnclick}
            className="
        px-8 py-4 rounded-full bg-[#716969] text-white
        hover:bg-red-800 font-semibold shadow-lg
        transition-all duration-300 ease-in-out
        text-base
      "
            type="button"
        >
            {text}
        </button>
    );
};

export default CustomButton;
