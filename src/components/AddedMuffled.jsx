function AddedMuffled({muffled, muffled_name_correct, changeMuffled, deleteMuffled}) {
    return (
      <div className='card text-sm'>
            <div className='d-flex flex-column gap-2 p-2'>
                <div className="d-flex flex-row justify-content-between align-items-center gap-3">
                    <input type='text' className={"form-control form-control-sm "+(muffled_name_correct?"is-valid":"is-invalid")}
                        value={muffled.name} onChange={(e)=>changeMuffled(e, "name")} placeholder="Place name"/>
                    <button type="button" className="btn-close" onClick={deleteMuffled}></button>
                </div>
                <div className='d-flex flex-row justify-content-between align-items-center gap-2'>
                    <small>Muffle amount</small>
                    <input type='number' className="form-control form-control-sm w-50" value={muffled.muffle_amount} onChange={(e)=>changeMuffled(e, "muffle_amount")} min={0} max={1} step={0.05}/>
                </div>
                <div className='d-flex flex-row justify-content-between align-items-center gap-2'>
                    <small>Volume</small>
                    <input type='number' className="form-control form-control-sm w-50" value={muffled.volume} onChange={(e)=>changeMuffled(e, "volume")} min={0} max={1} step={0.05}/>
                </div>
            </div>
      </div>
    );
  }
  
  export default AddedMuffled;