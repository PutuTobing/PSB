function Dashboard() {
  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <p>Welcome to the Dashboard page.</p>
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text">Display user count from database.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Active Sessions</h5>
              <p className="card-text">Display active sessions.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Recent Activities</h5>
              <p className="card-text">List recent activities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
