import { useEffect, useState } from "react";
import { BaseResponse } from "../interfaces";

//new page with new form
export function CheckData() {
  const [status, setStatus] = useState<
    | "INITIAL"
    | "SEND_DATA"
    | "SENDING_DATA"
    | "DATA_SENDED"
    | "ERROR_SENDING_DATA"
  >();
  // setting value as object
  const [value, setValue] = useState<any>({
    name: "",
    age: "",
    birth: "",
    sposato: "",
  });
  const [data, setData] = useState<BaseResponse>();

  //API call within useEffect
  useEffect(() => {
    if (status === "SEND_DATA") {
      setStatus("SENDING_DATA");
      fetch("http://localhost:3001/data/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: value.name,
          age: value.age,
          birth: value.birth,
          sposato: value.sposato,
        }),
      })
        .then((rawResponse) => {
          if ([200, 201].includes(rawResponse.status)) {
            return rawResponse.json();
          } else {
            throw new Error();
          }
        })
        .then((response: BaseResponse) => {
          setStatus("DATA_SENDED");
          setData(response);
        })
        .catch((e) => {
          setStatus("ERROR_SENDING_DATA");
        });
    }
  }, [status, value]);

  if (status === "ERROR_SENDING_DATA") {
    return (
      <div>
        <h1>ERRORE INVIO DATI</h1>
        <button onClick={() => setStatus("INITIAL")}>RIPROVA</button>
      </div>
    );
  }

  if (status === "SEND_DATA" || status === "SENDING_DATA") {
    return (
      <div>
        <h1>INVIO IN CORSO</h1>
        <button onClick={() => setStatus("INITIAL")}>ANNULLA</button>
      </div>
    );
  }

  if (status === "DATA_SENDED") {
    return (
      <div>
        {data?.success === true && <h1>DATI INVIATI VALIDI</h1>}
        {data?.success === false && <h1>DATI INVIATI NON VALIDI</h1>}
        <button
          onClick={() => {
            setStatus("INITIAL");
            setValue({ name: "", age: "", birth: "", sposato: "" });
            //after re-initialization status, all fields go to empty.. initial state.
          }}
        >
          INVIA UN ALTRO VALORE
        </button>
      </div>
    );
  }
  return (
    <div>
      <h1>INSERISCI IL NOME</h1>
      <input
        name="name"
        type="text"
        value={value.name}
        onChange={(e) => {
          setValue((prev: object) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
        }} //prevention of loosing data within state changes
      ></input>
      <h1>INSERISCI TUA ETA</h1>
      <input
        name="age"
        type="number"
        value={value.age}
        onChange={(e) => {
          setValue((prev: object) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
        }} //prevention of loosing data within state changes
      ></input>
      <h1>INSERISCI DATA DI NASCITA</h1>
      <input
        name="birth"
        type="date"
        value={value.birth}
        onChange={(e) => {
          setValue((prev: object) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
        }} //prevention of loosing data within state changes
      ></input>
      <h1>SEI SPOSATO?</h1>

      <input
        name="sposato"
        type="text"
        value={value.sposato}
        onChange={(e) => {
          setValue((prev: object) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
        }} //prevention of loosing data within state changes
      ></input>
      <button onClick={() => setStatus("SEND_DATA")}>VALIDA</button>
    </div>
  );
}
