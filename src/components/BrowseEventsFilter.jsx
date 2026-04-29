import React, { useEffect } from 'react';
import aos from "aos";
import "aos/dist/aos.css";

const defaultCategories = ["All", "Music", "Tech", "Sports", "Arts", "Foods"];

const BrowseEventsFilter = ({
    filterEvent,
    categories = defaultCategories,
    activeCategory = "",
    onFilterSelect,
}) => {
    useEffect(() => {
        aos.init({ 
            duration: 1500,
            once: true, 
        });
    }, []);

    const getAnimation = (index) => {
        if (index === 0) return "fade-right";
        if (index === categories.length - 1) return "fade-left";
        return "fade-up";
    };

    const activeStyle = {
        backgroundColor: "rgb(27,181,204)",
        color: "white",
        borderColor: "rgb(27,181,204)",
    };

    return (
        <div>
            <div className='d-flex align-items-center gap-3 my-4 browse-filter-wrap'>
                {categories.map((category, index) => {
                    const isActive = activeCategory === category;

                    return (
                        <button
                            key={category}
                            type='button'
                            data-aos={getAnimation(index)}
                            style={{ ...filterEvent, ...(isActive ? activeStyle : {}) }}
                            onClick={() => onFilterSelect?.(category)}
                            className='btn m-0 rounded-4 px-4 py-1'
                        >
                            {category}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BrowseEventsFilter;
