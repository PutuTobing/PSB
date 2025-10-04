function DaftarPemasangan() {
  return (
    <div>
      <h1 className="mb-4">Daftar Pemasangan</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Map data dari database */}
          <tr>
            <td>1</td>
            <td>Example Installation</td>
            <td>Active</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Another Installation</td>
            <td>Inactive</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default DaftarPemasangan;
