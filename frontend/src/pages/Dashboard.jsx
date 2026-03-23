import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    
const navigate = useNavigate();

const handleCreate = function(){
    const id = uuidv4();
    navigate(`/editor/${id}`);
}

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-3xl font-bold mb-6">Portfolio Builder</h1>

      <button
        onClick={handleCreate}
        className="px-6 py-3 bg-black text-white rounded-lg"
      >
        Create New Portfolio
      </button>
    </div>
  )
}

export default Dashboard;