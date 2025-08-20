export default function GroupTable({ data }) {
  if (!data || !data.results) return null;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Roll</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Updated</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Total %</th>
          </tr>
        </thead>
        <tbody>
          {data.results.map((r) => (
            <tr key={r.roll}>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{r.roll}</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{r.name || '-'}</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{r.updatedOn || '-'}</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{
                r.totalAggPercent != null ? `${r.totalAggPercent}%` : '-'
              }</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}