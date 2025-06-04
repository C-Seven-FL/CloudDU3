import React from "react";
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import logo from './img/logo.jpg';

export default function Header() {
    return (
        <Navbar bg="light" expand="md" className="shadow-sm">
            <Container>
                    
                <Navbar.Brand as={Link} to="/">
                    Body 
                    <img
                        src={logo}
                        width={40}
                        height={40}
                        className="d-inline-block align-middle"
                        alt="Logo"
                    />{' '}
                    Guard
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">

                        <Nav.Link 
                            as={NavLink} 
                            to="/"
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                            >Dashboard
                        </Nav.Link>

                        <Nav.Link 
                            as={NavLink} 
                            to="/progressgraph"
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                            >Progress Graph
                        </Nav.Link>
                        
                    </Nav>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    )
}