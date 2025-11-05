// Componente de gráfico de líneas
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomLineChart = ({ data, dataKey = 'value', nameKey = 'name', title, multipleLines = false }) => {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        {title && <h5 className="card-title mb-3">{title}</h5>}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {multipleLines ? (
              <>
                <Line type="monotone" dataKey="quantity" stroke="#3b82f6" name="Cantidad" />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Ingresos" />
              </>
            ) : (
              <Line type="monotone" dataKey={dataKey} stroke="#3b82f6" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomLineChart;

