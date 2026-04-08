import React from "react";
import "./styles.css";
import { useNavigate } from "react-router/dist";
import { toast } from "../../components/toast/Toast";

export const SettingsPage = () => {
  const navigate = useNavigate();
  const [focus, setFocus] = React.useState(25);
  const [breakMin, setBreakMin] = React.useState(5);

  const save = () => {
    (window as any).api.setDurations(focus, breakMin);
    toast.success("Configurações salvas!");
  };

  return (
    <div className="config-container">
      <h2>Configurações</h2>
      <div className="config-form">
        <div className="input-group">
          <label>Foco (minutos)</label>
          <input
            type="number"
            min={1}
            value={focus}
            onChange={(e) => setFocus(Number(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label>Pausa (minutos)</label>
          <input
            type="number"
            min={1}
            value={breakMin}
            onChange={(e) => setBreakMin(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="config-buttons">
        <button className="btn-back" onClick={() => navigate("/")}>
          Voltar
        </button>
        <button className="btn-save" onClick={save}>
          Salvar
        </button>
      </div>
    </div>
  );
};
