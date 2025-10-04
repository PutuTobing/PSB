function ManajemenAkun() {
  return (
    <div>
      <h1 className="mb-4">Manajemen Akun</h1>
      <form>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <h2 className="mt-4">User List</h2>
      <ul className="list-group">
        <li className="list-group-item">User 1</li>
        <li className="list-group-item">User 2</li>
      </ul>
    </div>
  );
}

export default ManajemenAkun;
