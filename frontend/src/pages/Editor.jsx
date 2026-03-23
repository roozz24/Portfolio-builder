import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPortfolio, updateSection } from "../store/portfolioSlice";
import defaultPortfolio from "../utils/Portfolio";

function Editor() {

  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();

  const portfolio = useSelector(state => state.portfolio);

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div className="w-1/5 bg-gray-100 p-4">
        <h2 className="font-bold mb-4">Sections</h2>
        {portfolio.sections.map(sec => (
          <div
            key={sec.id}
            onClick={() => setSelected(sec)}
            className="p-2 border mb-2 cursor-pointer"
          >
            {sec.type}
          </div>
        ))}
      </div>

      {/* Editor Panel */}
      <div className="w-2/5 p-4 border-l border-r">
        <h2 className="font-bold mb-4">Editor</h2>

        {!selected && <p>Select a section</p>}

        {selected?.type === "hero" && (
          <>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);

                dispatch(updateSection({
                  id: selected.id,
                  data: {
                    ...selected.data,
                    name: e.target.value
                  }
                })
                );
              }}
              className="border p-2 mb-2 w-full"
            />
          </>
        )}

        {selected?.type === "about" && (
          <>
            <input
              type="text"
              placeholder="About you"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);

                dispatch(updateSection({
                  id: selected.id,
                  data: {
                    ...selected.data,
                    description: e.target.value
                  }
                })
                );
              }}
              className="border p-2 mb-2 w-full"
            />
          </>
        )}

      </div>

      {/* Preview Panel */}
      <div className="w-2/5 p-4">
        <h2 className="font-bold mb-4">Preview</h2>

        {portfolio.sections.map(sec => {
          if (sec.type === "hero") {
            return <div key={sec.id}>{sec.data.name}</div>;
          }
          if (sec.type === "about") {
            return <div key={sec.id}>{sec.data.description}</div>;
          }
          return null;
        })}
      </div>

    </div >
  );
}

export default Editor;