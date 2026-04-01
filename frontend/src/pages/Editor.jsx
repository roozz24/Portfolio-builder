import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPortfolio, updateSection } from "../store/portfolioSlice";
import defaultPortfolio from "../utils/Portfolio";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import SortableItem from "../components/sortableItem";

function Editor() {

  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const dispatch = useDispatch();

  const portfolio = useSelector(state => state.portfolio);

  useEffect(() => {
    if (selected?.type === "projects") {
      setProjects(selected.data);
    }
    if (selected?.type === "skills") {
      setSkills(selected.data);
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

  const handleDelete = (index) => {
    const updated = projects.filter((_, i) => i !== index);

    setProjects(updated);

    dispatch(updatedSection({
      id: selected.id,
      data: updated
    }));
  };

  const handleSkillChange = (index, value) => {
    const updated = skills.map((s, i) =>
      i === index ? value : s
    );

    setSkills(updated);

    dispatch(updateSection({
      id: selected.id,
      data: updated
    }));
  };

  const handleAddSkill = () => {
    const updated = [...skills, ""];
    setSkills(updated);

    dispatch(updateSection({
      id: selected.id,
      data: updated
    }));
  };

  const handleDeleteSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);

    dispatch(updateSection({
      id: selected.id,
      data: updated
    }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if(!over) return;

    if (active.id !== over.id) {
      const oldIndex = portfolio.sections.findIndex(s => s.id === active.id);
      const newIndex = portfolio.sections.findIndex(s => s.id === over.id);

      const newSections = arrayMove(portfolio.sections, oldIndex, newIndex);

      dispatch(updateSection({
        id: "sections",
        data: newSections
      }));
    }
  };

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div className="w-1/5 bg-gray-100 p-4">
        <h2 className="font-bold mb-4">Sections</h2>
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
          <SortableContext
            items={portfolio.sections.map(sec => sec.id)}
            strategy={verticalListSortingStrategy}
          >
            {portfolio.sections.map(sec => (
              <SortableItem key={sec.id} sec={sec} setSelected={setSelected} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Editor Panel */}
      <div className="w-2/5 p-4 border-l border-r">
        <h2 className="font-bold mb-4">Editor</h2>

        {!selected && <p>Select a section</p>}

        {selected?.type === "Hero" && (
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

        {selected?.type === "About" && (
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

        {selected?.type === "Projects" && (
          <>
            {projects.map((proj, index) => (
              <div key={index} className="mb-5 border p-3 rounded flex flex-col">

                <h3 className="font-semibold mb-2">
                  Project {index + 1}
                </h3>

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

                <div>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 text-white rounded-md px-2 py-1 mt-2">
                    Delete
                  </button>
                </div>

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
              className="bg-black text-white px-3 py-1 rounded-md">
              Add Project
            </button>

          </>
        )}

        {selected?.type === "Skills" && (
          <>
            {skills.map((skill, index) => (
              <div key={index} className="mb-2 flex gap-2">

                <input
                  type="text"
                  value={skill}
                  placeholder="eg; react, JavaScript"
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  className="border p-2 w-full"
                />

                <button
                  onClick={() => handleDeleteSkill(index)}
                  className="bg-red-500 text-white px-2"
                >
                  X
                </button>

              </div>
            ))}

            <button
              onClick={handleAddSkill}
              className="bg-black text-white px-3 py-1 rounded-md"
            >
              Add Skill
            </button>
          </>
        )}

      </div>

      {/* Preview Panel */}
      <div className="w-2/5 p-4">
        <h2 className="font-bold mb-4">Preview</h2>

        {portfolio.sections.map(sec => {
          if (sec.type === "Hero") {
            return <div key={sec.id}>{sec.data.name}</div>;
          }
          if (sec.type === "About") {
            return <div key={sec.id}>{sec.data.description}</div>;
          }
          if (sec.type === "Projects") {
            return (
              <div key={sec.id}>
                <h2 className="font-bold mb-2">Projects</h2>
                {sec.data.map((proj, i) => (
                  <div key={i} className="mb-2">
                    <p className="font-semibold">{proj.title}</p>
                    <p className="text-sm">{proj.description}</p>
                  </div>
                ))}
              </div>
            );
          }
          if (sec.type === "Skills") {
            return (
              <div key={sec.id}>
                <h2 className="font-bold mb-2">Skills</h2>
                {sec.data.map((skill, i) => (
                  <span key={i} className="mr-2">
                    {skill}
                  </span>
                ))}
              </div>
            );
          }
          return null;
        })}
      </div>

    </div >
  );
}

export default Editor;