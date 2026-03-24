import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPortfolio, updateSection } from "../store/portfolioSlice";
import defaultPortfolio from "../utils/Portfolio";

function Editor() {

  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const dispatch = useDispatch();

  const portfolio = useSelector(state => state.portfolio);

  useEffect(() => {
    if (selected?.type === "projects") {
      setProjects(selected.data);
    }
  }, [selected]);

  const handleChange = (index, field, value) => {
    const updated = projects.map((proj, i) => {
      if (i === index) {
        return {
          ...proj,
          [field]: value
        };
      }
      return proj;
    });

    setProjects(updated);

    dispatch(
      updateSection({
        id: selected.id,
        data: updated
      })
    );
  };

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

        {selected?.type === "projects" && (
          <>
            {projects.map((proj, index) => (
              <div key={index} className="mb-4 border p-2">

                <input
                  type="text"
                  placeholder="Project Title"
                  value={proj.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  className="border p-1 mb-1 w-full"
                />

                <input
                  type="text"
                  placeholder="Project Description"
                  value={proj.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                  className="border p-1 mb-1 w-full"
                />

              </div>
            ))}
            <button
              onClick={() => {
                const newProjects = [
                  ...projects,
                  { title: "", description: "", link: "" }
                ];
                setProjects(newProjects);

                dispatch(updateSection({
                  id: selected.id,
                  data: newProjects
                })
                );
              }}
              className="bg-black text-white px-3 py-1 rounded-md text-md">
              New Project
            </button>
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