import React from 'react';

const Map = () => {
    return (
        <div style={{border: '1px dashed rgba(0,0,0,.3)', background: 'rgba(0,0,0,.04)', color: 'gray'}} className='text-center py-5 px-3 rounded-3'>
            <i className='bi bi-geo-alt fs-4'></i>
            <p className="m-0">Map preview will appear when address is complete</p>
        </div>
    );
};

export default Map;