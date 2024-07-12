import React from 'react';

const GuideList = ({ guide }) => {
  // Verifica si la guía tiene pasos
  const hasContent = guide["Guia de estudio"] !== "" || guide.Pasos.length > 0;

  return (
    <div>
      {hasContent && (
        <>
          <h2>Tópico: {guide["Guia de estudio"]}</h2>
          <h3>Pasos:</h3>
        </>
      )}
      <ul>
        {guide.Pasos.map((step, index) => (
          <p key={index}>{step}</p>
        ))}
      </ul>
    </div>
  );
};

export default GuideList;
