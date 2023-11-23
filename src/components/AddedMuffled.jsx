function AddedMuffled({muffled_name, muffled_name_correct, muffle_amount, changeMuffled, deleteMuffled}) {
    return (
      <div className='card text-sm'>
          <div className='card-body p-2'>
              <div className='row'>
                  <div className='col'>
                      <input type='text' className={"form-control form-control-sm "+(muffled_name_correct?"is-valid":"is-invalid")}
                          value={muffled_name} onChange={(e)=>changeMuffled(e, "name")} placeholder="Place name"/>
                  </div>
                  <div className='col px-1 d-flex justify-content-end align-items-center'>
                      <p className='card-text text-sm'>Muffle amount</p>
                  </div>
                  <div className="col-2 ps-1">
                      <input type='number' className="form-control form-control-sm" value={muffle_amount} onChange={(e)=>changeMuffled(e, "muffle_amount")} min={0} max={1} step={0.05}/>
                  </div>
                  <div className='col-1 d-flex justify-content-end align-items-center'>
                      <button type="button" className="btn-close" onClick={deleteMuffled}></button>
                  </div>
              </div>
          </div>
      </div>
    );
  }
  
  export default AddedMuffled;