function SettingsPage() {
  return (
    <>
        <h3>My API keys</h3>
        <div className="d-flex align-items-center gap-2">
            <p className="m-0">Freesound.com (short id code : "<b>fs::</b>1234"):</p>
            <input type="text" className="form-control w-50"
                    placeholder="Freesound API key"
                    value={localStorage.getItem("freesound_api_key") || ""}
                    onChange={(e)=>localStorage.setItem("freesound_api_key", e.target.value)}/>
        </div>
    </>
  );
}

export default SettingsPage;