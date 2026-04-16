import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

function PortfolioView() {
    const { id } = useParams();
    console.log("ID:", id);
    const [portfolio, setPortfolio] = useState(null);

    useEffect(() => {
        console.log("Portfolio:", portfolio);
        console.log("Sections:", portfolio?.sections);
        const loadPortfolio = async () => {
            const docRef = doc(db, "portfolios", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setPortfolio(docSnap.data());
            }
        };

        loadPortfolio();
    }, [id]);

    if (!portfolio) return <div>Loading...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {portfolio.sections.map((sec) => {
                if (sec.type === "Hero") {
                    return (
                        <div key={sec.id} className="mb-6">
                            <h1 className="text-3xl font-bold">{sec.data.name}</h1>
                        </div>
                    );
                }

                if (sec.type === "About") {
                    return (
                        <p key={sec.id} className="mb-6 text-gray-600">
                            {sec.data.description}
                        </p>
                    );
                }

                if (sec.type === "Projects") {
                    return (
                        <div key={sec.id} className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Projects</h2>
                            {sec.data.map((proj, i) => (
                                <div key={i} className="mb-3">
                                    <p className="font-semibold">{proj.title}</p>
                                    <p className="text-sm">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    );
                }

                if (sec.type === "Skills") {
                    return (
                        <div key={sec.id} className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Skills</h2>
                            <div className="flex gap-2 flex-wrap">
                                {sec.data.map((skill, i) => (
                                    <span key={i} className="bg-gray-200 px-2 py-1 rounded">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
}

export default PortfolioView;