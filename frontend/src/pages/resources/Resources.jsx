import './styles.css';

export default function Resources() {
    return (
      <div className="p-6">
        <div className="flex justify-center items-start">
            <div className="PrimaryInfo">
            <div className="xButton">
                <span className="material-symbols-outlined">close</span>
            </div>

            <div className="classTitle">Class Name</div>
            <div className="classCode">ABC1234</div>
            <div className="professorName">Dr.ProfessorName</div>

            <div className="divider"></div>

            <div className="documentSection">
                <div className="bar1">Documents</div>

                <div className="docOptions">
                    <div className="doc1"></div>
                    <div className="doc2"></div>
                    <div className="doc3"></div>
                </div>
            </div>

            <div className="videoSection">
                <div className="bar2">Videos</div>

                <div className="videoOptions">
                    <div className="video1"></div>
                    <div className="video2"></div>
                    <div className="video3"></div>
                </div>
            </div>
        </div>
        </div>
      </div>
    );
  }
  
  