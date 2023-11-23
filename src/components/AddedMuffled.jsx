function AddedMuffled({muffled_name, muffled_name_correct, name_change, muffled_amount, muffled_amount_change, delete_muffled}) {
    return (
      <div className='card text-sm'>
          <div className='card-body p-2'>
              <div className='row'>
                  <div className='col'>
                      <input type='text' className={"form-control form-control-sm "+(muffled_name_correct?"is-valid":"is-invalid")}
                          value={muffled_name} onChange={name_change} placeholder="Place name"/>
                  </div>
                  <div className='col px-1 d-flex justify-content-end align-items-center'>
                      <p className='card-text text-sm'>Muffle amount</p>
                  </div>
                  <div className="col-2 ps-1">
                      <input type='number' className="form-control form-control-sm" value={muffled_amount} onChange={muffled_amount_change} min={0} max={1} step={0.05}/>
                  </div>
                  <div className='col-1 d-flex justify-content-end align-items-center'>
                      <button type="button" className="btn-close" onClick={delete_muffled}></button>
                  </div>
              </div>
          </div>
      </div>
    );
  }
  
  export default AddedMuffled;