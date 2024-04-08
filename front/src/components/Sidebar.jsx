import { NavLink } from 'react-router-dom';
import React, { useState } from 'react';

const Sidebar = () => {

    const [openTab, setOpenTab] = useState(true);

    const ToggleMenu = () => {
        setOpenTab(!openTab);
    }

    // a chaque redimensionnement de la fenetre, si la largeur est inferieur a 800px, on ferme le menu
    window.addEventListener('resize', () => {
        if (window.innerWidth < 1000) {
            setOpenTab(false);
        }else{
            setOpenTab(true);
        }
    });

    // check size on load
    window.addEventListener('load', () => {
        if (window.innerWidth < 1000) {
            setOpenTab(false);
        }
    });

    return (
            <aside className={openTab ? 'is_expanded' : ''}>
                <div className="logo">
                    <img src="" alt=""/>
                </div>

                <h3 className="logo">BudgetEye.</h3>
                <div className="menu">
                        <NavLink className={"button"} to={"/"}>
                            <span className="material-icons">home</span>
                            <span className="text">Factures</span>
                        </NavLink>
                        <NavLink className="button" to="/bilans">
                            <span className="material-icons">group</span>
                            <span className="text">Bilan</span>
                        </NavLink>
                        <NavLink className="button" to="/category">
                            <span className="material-icons">business</span>
                            <span className="text">Catégories</span>
                        </NavLink>
                    </div>
            </aside>
    );
};

export default Sidebar;