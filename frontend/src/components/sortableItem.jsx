import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ sec, setSelected }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: sec.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="p-2 border mb-2 bg-white flex justify-between items-center"
        >
            {/* Click area */}
            <div
                onClick={() => setSelected(sec)}
                className="cursor-pointer flex-1"
            >
                {sec.type}
            </div>

            {/* Drag handle */}
            <span
                {...attributes}
                {...listeners}
                className="cursor-grab px-2"
            >
                ☰
            </span>
        </div>
    );
}

export default SortableItem;