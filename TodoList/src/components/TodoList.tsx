import { useEffect, useState } from "react";
import AddWork from "./AddWork";

interface Work {
  id: string;
  name: string;
  status: boolean;
}

export default function TodoList() {
  const [listWork, setListWork] = useState<Work[]>(() => {
    const savedWorks = localStorage.getItem("listWork");
    return savedWorks ? JSON.parse(savedWorks) : [];
  });

  useEffect(() => {
    localStorage.setItem("listWork", JSON.stringify(listWork));
  }, [listWork]);

  return (
    <>
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card">
                <div className="card-body p-5">
                  <AddWork />
                  {/* Tabs navs */}

                  {/* Tabs navs */}
                  {/* Tabs content */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
