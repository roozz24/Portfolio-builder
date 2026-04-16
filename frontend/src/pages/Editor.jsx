import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPortfolio, updateSection } from "../store/portfolioSlice";
import defaultPortfolio from "../utils/Portfolio";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import SortableItem from "../components/sortableItem";
import { db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { getDoc } from "firebase/firestore";

function Editor() {
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const dispatch = useDispatch();
  const { id } = useParams();

  const portfolio = useSelector((state) => state.portfolio);

  useEffect(() => {
    console.log(portfolio.sections);
    const loadPortfolio = async () => {
      const docRef = doc(db, "portfolios", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        dispatch(setPortfolio(docSnap.data()));
      } else {
        dispatch(setPortfolio(defaultPortfolio));
      }
    };

    loadPortfolio();
  }, [id, dispatch]);

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
          [field]: value,
        };
      }
      return proj;
    });

    setProjects(updated);

    dispatch(
      updateSection({
        id: selected.id,
        data: updated,
      })
    );
  };

  const handleDelete = (index) => {
    const updated = projects.filter((_, i) => i !== index);

    setProjects(updated);

    dispatch(
      updateSection({
        id: selected.id,
        data: updated,
      })
    );
  };

  const handleSkillChange = (index, value) => {
    const updated = skills.map((s, i) => (i === index ? value : s));

    setSkills(updated);

    dispatch(
      updateSection({
        id: selected.id,
        data: updated,
      })
    );
  };

  const handleAddSkill = () => {
    const updated = [...skills, ""];
    setSkills(updated);

    dispatch(
      updateSection({
        id: selected.id,
        data: updated,
      })
    );
  };

  const handleDeleteSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);

    dispatch(
      updateSection({
        id: selected.id,
        data: updated,
      })
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = portfolio.sections.findIndex((s) => s.id === active.id);
      const newIndex = portfolio.sections.findIndex((s) => s.id === over.id);

      const newSections = arrayMove(portfolio.sections, oldIndex, newIndex);

      dispatch(
        updateSection({
          id: "sections",
          data: newSections,
        })
      );
    }
  };

  const handleSave = async () => {
    console.log("ID:", id);
    console.log("DB:", db);
    try {
      await setDoc(doc(db, "portfolios", id), portfolio);
      console.log("Saved portfolio:");
      alert("Saved successfully");
    } catch (err) {
      console.error(err);
    }
  };

  // --- Reusable Tailwind Class Constants for UI Consistency ---
  const inputStyles =
    "w-full bg-white text-zinc-900 border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all shadow-sm";
  const btnPrimary =
    "bg-zinc-900 text-white hover:bg-zinc-800 transition-colors px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm active:scale-[0.98]";
  const btnSecondary =
    "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 transition-colors px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm active:scale-[0.98]";

  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden font-sans text-zinc-900 antialiased">

      {/* Sidebar - Navigation / Draggable Items */}
      <div className="w-[280px] flex-shrink-0 bg-white border-r border-zinc-200 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-zinc-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
            Sections Layout
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Drag to reorder sections</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <SortableContext
              items={portfolio.sections.map((sec) => sec.id)}
              strategy={verticalListSortingStrategy}
            >
              {portfolio.sections.map((sec) => (
                <SortableItem key={sec.id} sec={sec} setSelected={setSelected} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Editor Panel */}
      <div className="w-[450px] flex-shrink-0 bg-zinc-50/50 border-r border-zinc-200 flex flex-col z-0">

        {/* Top Actions Bar */}
        <div className="p-5 border-b border-zinc-200 bg-white flex items-center justify-between sticky top-0 z-10">
          <h2 className="font-semibold text-zinc-800">Editor Settings</h2>
          <div className="flex gap-2">
            <a
              href={`/portfolio/${id}`}
              target="_blank"
              rel="noreferrer"
              className={btnSecondary}
            >
              Preview live
            </a>
            <button onClick={handleSave} className={btnPrimary}>
              Save Changes
            </button>
          </div>
        </div>

        {/* Form Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-3">
              <svg className="w-10 h-10 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <p className="text-sm font-medium">Select a section to edit</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="mb-6">
                <span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600 mb-2 uppercase tracking-wide">
                  Editing {selected.type}
                </span>
              </div>

              {/* Hero Editor */}
              {selected?.type === "Hero" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jane Doe"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        dispatch(
                          updateSection({
                            id: selected.id,
                            data: {
                              ...selected.data,
                              name: e.target.value,
                            },
                          })
                        );
                      }}
                      className={inputStyles}
                    />
                  </div>
                </div>
              )}

              {/* About Editor */}
              {selected?.type === "About" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Biography
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Write a little about yourself..."
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        dispatch(
                          updateSection({
                            id: selected.id,
                            data: {
                              ...selected.data,
                              description: e.target.value,
                            },
                          })
                        );
                      }}
                      className={`${inputStyles} resize-none`}
                    />
                  </div>
                </div>
              )}

              {/* Projects Editor */}
              {selected?.type === "Projects" && (
                <div className="space-y-5">
                  {projects.map((proj, index) => (
                    <div
                      key={index}
                      className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm relative group transition-all hover:shadow-md"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-sm text-zinc-800">
                          Project {index + 1}
                        </h3>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-zinc-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
                          title="Delete Project"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Project Title"
                          value={proj.title}
                          onChange={(e) => handleChange(index, "title", e.target.value)}
                          className={inputStyles}
                        />
                        <textarea
                          rows={3}
                          placeholder="Short description..."
                          value={proj.description}
                          onChange={(e) => handleChange(index, "description", e.target.value)}
                          className={`${inputStyles} resize-none`}
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      const newProjects = [
                        ...projects,
                        { title: "", description: "", link: "" },
                      ];
                      setProjects(newProjects);
                      dispatch(
                        updateSection({
                          id: selected.id,
                          data: newProjects,
                        })
                      );
                    }}
                    className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-600 font-medium text-sm hover:border-zinc-400 hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Project
                  </button>
                </div>
              )}

              {/* Skills Editor */}
              {selected?.type === "Skills" && (
                <div className="space-y-3">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={skill}
                        placeholder="e.g. React, Node.js"
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                        className={inputStyles}
                      />
                      <button
                        onClick={() => handleDeleteSkill(index)}
                        className="flex-shrink-0 text-zinc-400 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        title="Remove skill"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  <div className="pt-2">
                    <button
                      onClick={handleAddSkill}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-sm font-medium rounded-lg transition-colors w-full"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Skill
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preview Panel - Rendered like a canvas/document */}
      <div className="flex-1 bg-[#F0F2F5] overflow-y-auto p-8 lg:p-12 relative shadow-[inset_10px_0_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-3xl mx-auto bg-white min-h-[800px] shadow-xl shadow-zinc-200/40 rounded-2xl ring-1 ring-black/5 overflow-hidden">

          {/* Mock Browser Header */}
          <div className="h-12 bg-zinc-50 border-b border-zinc-100 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>

          <div className="p-10 lg:p-16">
            {portfolio.sections.map((sec) => {

              if (sec.type === "Hero") {
                return (
                  <div key={sec.id} className="mb-16">
                    <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 mb-4">
                      {sec.data.name || "Your Name"}
                    </h1>
                    <div className="w-16 h-1.5 bg-indigo-500 rounded-full"></div>
                  </div>
                );
              }

              if (sec.type === "About") {
                return (
                  <div key={sec.id} className="mb-16">
                    <p className="text-lg text-zinc-600 leading-relaxed max-w-2xl">
                      {sec.data.description || "Write something interesting about yourself..."}
                    </p>
                  </div>
                );
              }

              if (sec.type === "Projects") {
                return (
                  <div key={sec.id} className="mb-16">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center gap-3">
                      Selected Works
                    </h2>
                    <div className="grid gap-6">
                      {sec.data.length === 0 ? (
                        <p className="text-zinc-400 italic">No projects added yet.</p>
                      ) : (
                        sec.data.map((proj, i) => (
                          <div key={i} className="group p-6 rounded-xl border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:shadow-lg hover:border-zinc-200 transition-all duration-300">
                            <h3 className="text-xl font-semibold text-zinc-900 mb-2">
                              {proj.title || `Project ${i + 1}`}
                            </h3>
                            <p className="text-zinc-600 leading-relaxed">
                              {proj.description || "Project description goes here."}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              }

              if (sec.type === "Skills") {
                return (
                  <div key={sec.id} className="mb-16">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-6">Expertise</h2>
                    {sec.data.length === 0 ? (
                      <p className="text-zinc-400 italic">No skills added yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2.5">
                        {sec.data.map((skill, i) => (
                          skill && (
                            <span
                              key={i}
                              className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-full text-sm font-medium border border-zinc-200/60"
                            >
                              {skill}
                            </span>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;