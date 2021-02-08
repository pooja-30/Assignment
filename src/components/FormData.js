import React from "react";

function FormData(props) {
  return (
    <div>
      <form>
        <input
          type="text"
          id="poi"
          name="poi"
          value={props.poi}
          onChange={props.handleEvent}
        ></input>
        <input
          type="text"
          id="horizon"
          name="horizon"
          value={props.horizon}
          onChange={props.handleEvent}
        ></input>
        <button type="submit" className="submit" onClick={props.filterData}>
          SUBMIT
        </button>
      </form>
    </div>
  );
}

export default FormData;
