// Componente de carga
const Loading = ({ message = 'Cargando...' }) => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{message}</span>
        </div>
        <p className="mt-3 text-muted">{message}</p>
      </div>
    </div>
  );
};

export default Loading;

