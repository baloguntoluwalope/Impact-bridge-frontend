import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <>
      <Helmet><title>Page Not Found — Impact Bridge</title></Helmet>
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--gray-50)', padding:24, textAlign:'center' }}>
        <div style={{ maxWidth:480 }}>
          <div style={{ fontSize:80, marginBottom:24, lineHeight:1 }}>😔</div>
          <h1 style={{ fontSize:48, fontWeight:900, color:'var(--gray-900)', letterSpacing:'-2px', marginBottom:12 }}>404</h1>
          <h2 style={{ fontSize:22, fontWeight:700, color:'var(--gray-700)', marginBottom:16 }}>Page not found</h2>
          <p style={{ fontSize:15, color:'var(--gray-400)', lineHeight:1.7, marginBottom:36 }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/"><Button size="lg">Back to Home</Button></Link>
        </div>
      </div>
    </>
  );
}