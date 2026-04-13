import React from 'react';
import AdminAuthLeftPanel from '../components/AdminAuthLeftPanel';
import LeftPanel from '../components/LeftPanel';

const AdminAuthPage = () => {
    return (
        <div className='d-flex align-items-stretch'>
            <AdminAuthLeftPanel />
            <div style={{ backgroundColor: 'rgb(249,250,251)', padding: '2em' }} className='w-50'>
                <div style={{ width: '450px', margin: '80px auto' }} className='bg-white rounded-4 py-4 px-4 shadow-sm'>
                    <div className='mb-4'>
                        <h5 className='m-0 mb-1 fw-semibold'>Admin Portal</h5>
                        <p style={{ fontSize: '.9em' }} className="m-0 text-secondary">Restricted Access</p>
                    </div>
                    <div>
                        <div className='form-group'>
                            <label htmlFor="adminEmail">Admin Email</label>
                            <input type="email" placeholder='admin@example.com' id='adminEmail' name='adminEmail' className='form-control shadow-none admin-input' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="adminPassword">Password</label>
                            <input type="password" placeholder='Admin Password' id='adminPassword' name='adminPassword' className='form-control shadow-none admin-input' />
                        </div>
                        <button style={{ background: 'rgb(49,46,129)' }} className='btn py-2 px-3 rounded-3 text-white w-100 mt-3 fw-semibold'>Sign In To Dashboard</button>
                        <div style={{fontSize: '.9em'}} className="d-flex align-items-center gap-2 alert alert-secondary p-3 w-100 border rounded-3 mt-4 m-0">
                            <i className='bi bi-exclamation-triangle'></i>
                            <p className='m-0'>This portal is for authorized administrators only. All access is logged and monitored.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminAuthPage;